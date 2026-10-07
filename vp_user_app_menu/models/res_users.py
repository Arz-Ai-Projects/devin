# -*- coding: utf-8 -*-
from odoo import models, fields, api

class ResUsers(models.Model):
    _inherit = 'res.users'

    launcher_config_id = fields.One2many(
        'vp.launcher.user.config',
        'user_id',
        string='Launcher Config'
    )
