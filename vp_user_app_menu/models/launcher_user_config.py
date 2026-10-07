# -*- coding: utf-8 -*-
import json
import logging
from odoo import models, fields, api, _

_logger = logging.getLogger(__name__)

class LauncherUserConfig(models.Model):
    _name = 'vp.launcher.user.config'
    _description = 'Launcher User Custom Configuration'
    _order = 'user_id'

    user_id = fields.Many2one(
        'res.users',
        string='User',
        required=True,
        ondelete='cascade',
        index=True
    )
    layout_json = fields.Text(
        string='Custom Layout JSON',
        default='{}',
        help='Serialized JSON storing user custom layout (folders, items, sequence, personal folders, hidden flags, favorites).'
    )
    favorite_menu_ids = fields.Many2many(
        'ir.ui.menu',
        'vp_launcher_user_favorites_rel',
        'config_id',
        'menu_id',
        string='Favorite Menus'
    )
    recent_menu_ids = fields.Char(
        string='Recent Menu IDs',
        default='[]',
        help='JSON array of recently opened menu IDs'
    )

    _sql_constraints = [
        ('user_uniq', 'unique(user_id)', 'A user configuration record already exists for this user!')
    ]

    @api.model
    def _get_user_allowed_menus(self):
        """
        Fetch all ir.ui.menu records accessible by current user.
        Uses _filter_visible_menus() to enforce Odoo security rules, groups_id checks, and action rights.
        """
        menus = self.env['ir.ui.menu'].search([])
        visible_menus = menus._filter_visible_menus()
        return set(visible_menus.ids)

    @api.model
    def get_launcher_data(self):
        """
        Main RPC endpoint to get launcher configuration for current user.
        Resolves hierarchy:
        1. User Configuration
        2. Role/Group Configuration
        3. Default Configuration (All accessible root apps or defined global folders)
        """
        user = self.env.user
        allowed_menu_ids = self._get_user_allowed_menus()

        # Fetch menu detailed dicts (name, action, icon, parent_id, web_icon, etc)
        menu_details = {}
        if allowed_menu_ids:
            menus = self.env['ir.ui.menu'].browse(list(allowed_menu_ids)).sudo()
            for menu in menus:
                web_icon = menu.web_icon or False
                icon_data = False
                if menu.web_icon_data:
                    icon_data = menu.web_icon_data.decode('utf-8') if isinstance(menu.web_icon_data, bytes) else menu.web_icon_data

                action_id = False
                if menu.action:
                    action_id = menu.action.id

                menu_details[menu.id] = {
                    'id': menu.id,
                    'name': menu.name,
                    'complete_name': menu.complete_name,
                    'action': menu.action and f"{menu.action._name},{menu.action.id}" or False,
                    'action_id': action_id,
                    'web_icon': web_icon,
                    'web_icon_data': icon_data,
                    'xmlid': menu.xml_id or '',
                    'parent_id': menu.parent_id.id if menu.parent_id else False,
                }

        # Check for user config
        user_config = self.search([('user_id', '=', user.id)], limit=1)

        user_layout = None
        if user_config and user_config.layout_json:
            try:
                user_layout = json.loads(user_config.layout_json)
            except Exception as e:
                _logger.warning("Failed to parse user launcher config JSON: %s", e)
                user_layout = None

        favorites = []
        recents = []
        if user_config:
            favorites = [m_id for m_id in user_config.favorite_menu_ids.ids if m_id in allowed_menu_ids]
            try:
                recents = [m_id for m_id in json.loads(user_config.recent_menu_ids or '[]') if m_id in allowed_menu_ids]
            except Exception:
                recents = []

        # Step 1: User configuration
        if user_layout and isinstance(user_layout, dict) and user_layout.get('folders'):
            final_folders = self._build_user_folders(user_layout['folders'], menu_details, allowed_menu_ids)
            return {
                'folders': final_folders,
                'favorites': favorites,
                'recents': recents,
                'all_accessible_menus': menu_details,
                'is_customized': True,
            }

        # Step 2: Role / Group Configuration
        role_folders = self._get_role_configuration(user)
        if role_folders:
            final_folders = self._build_role_folders(role_folders, menu_details, allowed_menu_ids)
            return {
                'folders': final_folders,
                'favorites': favorites,
                'recents': recents,
                'all_accessible_menus': menu_details,
                'is_customized': False,
            }

        # Step 3: Default Configuration
        default_folders = self._get_default_configuration(user, menu_details, allowed_menu_ids)
        return {
            'folders': default_folders,
            'favorites': favorites,
            'recents': recents,
            'all_accessible_menus': menu_details,
            'is_customized': False,
        }

    @api.model
    def _get_role_configuration(self, user):
        user_group_ids = user.groups_id.ids
        roles = self.env['vp.launcher.role'].search([('active', '=', True)], order='sequence asc, id asc')

        matched_folders = self.env['vp.launcher.folder']
        for role in roles:
            role_group_ids = role.group_ids.ids
            if any(gid in user_group_ids for gid in role_group_ids):
                matched_folders |= role.folder_ids
                break

        return matched_folders

    @api.model
    def _get_default_configuration(self, user, menu_details, allowed_menu_ids):
        user_group_ids = user.groups_id.ids
        global_folders = self.env['vp.launcher.folder'].search([('active', '=', True)], order='sequence asc, id asc')

        assigned_folders = self.env['vp.launcher.folder']
        for folder in global_folders:
            if folder.user_ids and user.id in folder.user_ids.ids:
                assigned_folders |= folder
            elif folder.group_ids and any(gid in user_group_ids for gid in folder.group_ids.ids):
                assigned_folders |= folder
            elif not folder.user_ids and not folder.group_ids:
                assigned_folders |= folder

        if assigned_folders:
            return self._build_role_folders(assigned_folders, menu_details, allowed_menu_ids)

        # Fallback: Automatic root app folder generation
        root_menus = self.env['ir.ui.menu'].search([
            ('id', 'in', list(allowed_menu_ids)),
            ('parent_id', '=', False)
        ], order='sequence asc, id asc')

        default_folder_list = []

        for m in root_menus:
            submenus = self.env['ir.ui.menu'].search([
                ('id', 'in', list(allowed_menu_ids)),
                ('parent_id', '=', m.id)
            ], order='sequence asc, id asc')

            folder_items = []
            if submenus:
                for sub in submenus:
                    folder_items.append({
                        'menu_id': sub.id,
                        'name': sub.name,
                        'custom_name': sub.name,
                        'hidden': False,
                        'sequence': sub.sequence,
                        'action': menu_details.get(sub.id, {}).get('action'),
                        'web_icon': menu_details.get(sub.id, {}).get('web_icon'),
                    })
            else:
                folder_items.append({
                    'menu_id': m.id,
                    'name': m.name,
                    'custom_name': m.name,
                    'hidden': False,
                    'sequence': m.sequence,
                    'action': menu_details.get(m.id, {}).get('action'),
                    'web_icon': menu_details.get(m.id, {}).get('web_icon'),
                })

            default_folder_list.append({
                'id': f"default_{m.id}",
                'name': m.name,
                'icon': 'fa-folder',
                'is_personal': False,
                'hidden': False,
                'sequence': m.sequence,
                'items': folder_items,
            })

        return default_folder_list

    @api.model
    def _build_role_folders(self, folders, menu_details, allowed_menu_ids):
        result = []
        for f in folders:
            items = []
            for item in f.item_ids.sorted(key=lambda r: r.sequence):
                if item.menu_id.id in allowed_menu_ids:
                    items.append({
                        'menu_id': item.menu_id.id,
                        'name': item.custom_name or item.menu_id.name,
                        'custom_name': item.custom_name or item.menu_id.name,
                        'hidden': False,
                        'sequence': item.sequence,
                        'action': menu_details.get(item.menu_id.id, {}).get('action'),
                        'web_icon': menu_details.get(item.menu_id.id, {}).get('web_icon'),
                    })

            result.append({
                'id': f"folder_{f.id}",
                'db_id': f.id,
                'name': f.name,
                'icon': f.icon or 'fa-folder',
                'is_personal': False,
                'hidden': False,
                'sequence': f.sequence,
                'items': items,
            })
        return result

    @api.model
    def _build_user_folders(self, user_folders_data, menu_details, allowed_menu_ids):
        result = []
        for f in user_folders_data:
            valid_items = []
            for item in f.get('items', []):
                m_id = item.get('menu_id')
                if m_id in allowed_menu_ids:
                    m_info = menu_details.get(m_id, {})
                    valid_items.append({
                        'menu_id': m_id,
                        'name': item.get('custom_name') or m_info.get('name', 'App'),
                        'custom_name': item.get('custom_name') or m_info.get('name', 'App'),
                        'hidden': bool(item.get('hidden', False)),
                        'sequence': item.get('sequence', 10),
                        'action': m_info.get('action'),
                        'web_icon': m_info.get('web_icon'),
                    })

            result.append({
                'id': str(f.get('id')),
                'db_id': f.get('db_id'),
                'name': f.get('name', 'Folder'),
                'icon': f.get('icon', 'fa-folder'),
                'is_personal': bool(f.get('is_personal', False)),
                'hidden': bool(f.get('hidden', False)),
                'sequence': f.get('sequence', 10),
                'items': valid_items,
            })
        return result

    @api.model
    def save_layout_config(self, layout_data):
        user = self.env.user
        config = self.search([('user_id', '=', user.id)], limit=1)
        if not config:
            config = self.create({'user_id': user.id})

        folders = layout_data.get('folders', [])
        favorites = layout_data.get('favorites', [])
        recents = layout_data.get('recents', [])

        layout_json = json.dumps({'folders': folders})

        allowed_menu_ids = self._get_user_allowed_menus()
        valid_fav_ids = [m_id for m_id in favorites if m_id in allowed_menu_ids]

        config.write({
            'layout_json': layout_json,
            'favorite_menu_ids': [(6, 0, valid_fav_ids)],
            'recent_menu_ids': json.dumps(recents[:10]),
        })
        return True

    @api.model
    def reset_layout_config(self):
        user = self.env.user
        config = self.search([('user_id', '=', user.id)], limit=1)
        if config:
            config.write({
                'layout_json': '{}',
                'favorite_menu_ids': [(5, 0, 0)],
                'recent_menu_ids': '[]',
            })
        return self.get_launcher_data()

    @api.model
    def add_recent_menu(self, menu_id):
        user = self.env.user
        allowed_menu_ids = self._get_user_allowed_menus()
        if menu_id not in allowed_menu_ids:
            return False

        config = self.search([('user_id', '=', user.id)], limit=1)
        if not config:
            config = self.create({'user_id': user.id})

        try:
            recents = json.loads(config.recent_menu_ids or '[]')
        except Exception:
            recents = []

        if menu_id in recents:
            recents.remove(menu_id)
        recents.insert(0, menu_id)
        recents = recents[:10]

        config.write({'recent_menu_ids': json.dumps(recents)})
        return True
