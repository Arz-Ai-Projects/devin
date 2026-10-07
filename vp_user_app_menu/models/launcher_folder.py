# -*- coding: utf-8 -*-
from odoo import models, fields, api

class LauncherFolder(models.Model):
    _name = 'vp.launcher.folder'
    _description = 'Launcher Folder Template'
    _order = 'sequence, name'

    name = fields.Char(string='Folder Name', required=True)
    icon = fields.Char(string='Icon Class or Emoji', default='fa-folder', help='FontAwesome class or emoji for folder display.')
    sequence = fields.Integer(string='Sequence', default=10)

    # Target assignments
    group_ids = fields.Many2many(
        'res.groups',
        'vp_launcher_folder_group_rel',
        'folder_id',
        'group_id',
        string='Assigned Security Groups',
        help='If specified, this folder will apply to users belonging to any of these groups.'
    )
    user_ids = fields.Many2many(
        'res.users',
        'vp_launcher_folder_user_rel',
        'folder_id',
        'user_id',
        string='Assigned Direct Users',
        help='Directly assign folder to specific users.'
    )

    item_ids = fields.One2many(
        'vp.launcher.folder.item',
        'folder_id',
        string='Folder Apps / Items',
        copy=True
    )

    active = fields.Boolean(default=True)
