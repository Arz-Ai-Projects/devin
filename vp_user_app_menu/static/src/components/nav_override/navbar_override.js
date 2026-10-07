/** @odoo-module **/

import { NavBar } from "@web/webclient/navbar/navbar";
import { patch } from "@web/core/utils/patch";

patch(NavBar.prototype, {
    onNavBarAppLauncherClick() {
        if (this.env && this.env.services && this.env.services.action) {
            this.env.services.action.doAction("vp_user_app_menu.action_app_launcher");
        }
    }
});
