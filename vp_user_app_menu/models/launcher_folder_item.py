# -*- coding: utf-8 -*-
from odoo import models, fields, api

class LauncherFolderItem(models.Model):
    _name = 'vp.launcher.folder.item'
    _description = 'Launcher Folder Item'
    _order = 'sequence, id'

    folder_id = fields.Manyone(
        'vp.launcher.folder',
        string='Folder',
        ondelete='cascade',
        required=True
    )
    menu_id = fields.Many2one(
        'ir.ui.menu',
        string='Odoo Menu',
        ondelete='cascade',
        required=True
    )
    sequence = fields.Integer(string='Sequence', default=10)
    custom_name = fields.Char(string='Custom Display Name', help='Optional custom label for this menu item in launcher.')
