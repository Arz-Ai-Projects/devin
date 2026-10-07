# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request

class LauncherController(http.Controller):

    @http.route('/vp_launcher/get_data', type='json', auth='user')
    def get_launcher_data(self, **kw):
        return request.env['vp.launcher.user.config'].get_launcher_data()

    @http.route('/vp_launcher/save_layout', type='json', auth='user')
    def save_layout(self, layout_data, **kw):
        return request.env['vp.launcher.user.config'].save_layout_config(layout_data)

    @http.route('/vp_launcher/reset_layout', type='json', auth='user')
    def reset_layout(self, **kw):
        return request.env['vp.launcher.user.config'].reset_layout_config()

    @http.route('/vp_launcher/add_recent', type='json', auth='user')
    def add_recent(self, menu_id, **kw):
        return request.env['vp.launcher.user.config'].add_recent_menu(menu_id)
