# -*- coding: utf-8 -*-
from odoo import models, fields, api

class LauncherRole(models.Model):
    _name = 'vp.launcher.role'
    _description = 'Launcher Role Template'
    _order = 'sequence, name'

    name = fields.Char(string='Role Name', required=True)
    sequence = fields.Integer(string='Priority Sequence', default=10, help='Lower sequence numbers have higher priority when matching role configurations.')
    group_ids = fields.Many2many(
        'res.groups',
        'vp_launcher_role_group_rel',
        'role_id',
        'group_id',
        string='Odoo Groups',
        required=True
    )
    folder_ids = fields.Many2many(
        'vp.launcher.folder',
        'vp_launcher_role_folder_rel',
        'role_id',
        'folder_id',
        string='Included Folders'
    )
    active = fields.Boolean(default=True)
