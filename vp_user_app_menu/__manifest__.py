# -*- coding: utf-8 -*-
{
    'name': 'Vista User App Launcher',
    'version': '19.0.1.0.0',
    'category': 'Extra Tools',
    'summary': 'Modern folder-based application launcher with user customization and role templates for Odoo 19 Community.',
    'description': """
        Vista User App Launcher for Odoo 19 Community:
        - Modern folder-based Home Menu replacement
        - User-specific launcher layout customization (drag & drop, reordering, custom folders, favorites)
        - Role & Odoo Group based launcher template configurations
        - Strict adherence to Odoo security access rights and menu permissions
        - Clean responsive OWL interface with Vista branding (#F7931E)
    """,
    'author': 'Vista Solutions',
    'website': 'https://www.vistasolutions.example.com',
    'license': 'LGPL-3',
    'depends': [
        'base',
        'web',
    ],
    'data': [
        'security/launcher_security.xml',
        'security/ir.model.access.csv',
        'views/launcher_folder_views.xml',
        'views/launcher_role_views.xml',
        'views/launcher_user_config_views.xml',
        'views/menu_views.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'vp_user_app_menu/static/src/scss/launcher_variables.scss',
            'vp_user_app_menu/static/src/components/app_launcher/app_launcher.scss',
            'vp_user_app_menu/static/src/components/app_launcher/app_launcher.xml',
            'vp_user_app_menu/static/src/components/app_launcher/app_launcher.js',
            'vp_user_app_menu/static/src/components/nav_override/navbar_override.xml',
            'vp_user_app_menu/static/src/components/nav_override/navbar_override.js',
        ],
    },
    'installable': True,
    'application': True,
    'auto_install': False,
}
