/** @odoo-module **/

import { Component, useState, onWillStart } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { rpc } from "@web/core/network/rpc";

export class AppLauncher extends Component {
    static template = "vp_user_app_menu.AppLauncher";

    setup() {
        this.actionService = useService("action");
        this.menuService = useService("menu");

        this.state = useState({
            folders: [],
            favorites: [],
            recents: [],
            allMenus: {},
            searchQuery: "",
            expandedFolders: {},
            showFolderModal: false,
            folderModalName: "",
            editingFolderId: null,
            draggedFolder: null,
            draggedItem: null,
            draggedSourceFolder: null,
        });

        onWillStart(async () => {
            await this.loadLauncherData();
        });
    }

    async _callRpc(route, params = {}) {
        if (typeof rpc === "function") {
            return await rpc(route, params);
        } else if (this.env && this.env.services && this.env.services.rpc) {
            return await this.env.services.rpc(route, params);
        }
        return {};
    }

    async loadLauncherData() {
        try {
            const res = await this._callRpc("/vp_launcher/get_data", {});
            this.state.folders = res.folders || [];
            this.state.favorites = res.favorites || [];
            this.state.recents = res.recents || [];
            this.state.allMenus = res.all_accessible_menus || {};

            const expanded = {};
            for (const f of this.state.folders) {
                expanded[f.id] = true;
            }
            this.state.expandedFolders = expanded;
        } catch (error) {
            console.error("Error loading launcher data:", error);
        }
    }

    onSearchInput(ev) {
        if (ev && ev.target) {
            this.state.searchQuery = ev.target.value;
        }
    }

    get favoriteItems() {
        const items = [];
        for (const menuId of this.state.favorites) {
            const menu = this.state.allMenus[menuId];
            if (menu) {
                items.push({
                    menu_id: menuId,
                    name: menu.name,
                    action: menu.action,
                    web_icon: menu.web_icon,
                    web_icon_data: menu.web_icon_data,
                });
            }
        }
        return items;
    }

    get recentItems() {
        const items = [];
        for (const menuId of this.state.recents) {
            const menu = this.state.allMenus[menuId];
            if (menu) {
                items.push({
                    menu_id: menuId,
                    name: menu.name,
                    action: menu.action,
                    web_icon: menu.web_icon,
                    web_icon_data: menu.web_icon_data,
                });
            }
        }
        return items;
    }

    get displayedFolders() {
        const query = (this.state.searchQuery || "").trim().toLowerCase();
        if (!query) {
            return this.state.folders;
        }

        const filtered = [];
        for (const f of this.state.folders) {
            const folderNameMatches = f.name.toLowerCase().includes(query);
            const matchingItems = (f.items || []).filter(item =>
                item.name.toLowerCase().includes(query)
            );

            if (folderNameMatches || matchingItems.length > 0) {
                filtered.push({
                    ...f,
                    items: folderNameMatches ? f.items : matchingItems,
                });
            }
        }
        return filtered;
    }

    isFolderExpanded(folderId) {
        return Boolean(this.state.expandedFolders[folderId]);
    }

    toggleFolderExpand(folderId) {
        this.state.expandedFolders[folderId] = !this.state.expandedFolders[folderId];
    }

    isFavorite(menuId) {
        return this.state.favorites.includes(menuId);
    }

    async toggleFavorite(menuId) {
        const idx = this.state.favorites.indexOf(menuId);
        if (idx > -1) {
            this.state.favorites.splice(idx, 1);
        } else {
            this.state.favorites.push(menuId);
        }
        await this.saveLayout();
    }

    async openApp(item) {
        if (!item || !item.menu_id) return;

        try {
            await this._callRpc("/vp_launcher/add_recent", { menu_id: item.menu_id });
            if (!this.state.recents.includes(item.menu_id)) {
                this.state.recents.unshift(item.menu_id);
                this.state.recents = this.state.recents.slice(0, 10);
            }
        } catch (e) {
            console.warn("Failed to record recent app:", e);
        }

        try {
            const menu = this.menuService.getMenu(item.menu_id);
            if (menu) {
                this.menuService.selectMenu(menu);
            } else if (item.action) {
                const [actionModel, actionId] = item.action.split(",");
                this.actionService.doAction(parseInt(actionId, 10));
            }
        } catch (e) {
            console.error("Failed to navigate to app action:", e);
        }
    }

    openCreateFolderModal() {
        this.state.editingFolderId = null;
        this.state.folderModalName = "";
        this.state.showFolderModal = true;
    }

    openRenameFolderModal(folder) {
        this.state.editingFolderId = folder.id;
        this.state.folderModalName = folder.name;
        this.state.showFolderModal = true;
    }

    closeFolderModal() {
        this.state.showFolderModal = false;
        this.state.folderModalName = "";
        this.state.editingFolderId = null;
    }

    async saveFolderModal() {
        const name = (this.state.folderModalName || "").trim();
        if (!name) return;

        if (this.state.editingFolderId) {
            const folder = this.state.folders.find(f => f.id === this.state.editingFolderId);
            if (folder) {
                folder.name = name;
            }
        } else {
            const newFolder = {
                id: `custom_${Date.now()}`,
                name: name,
                icon: "fa-folder-o",
                is_personal: true,
                hidden: false,
                sequence: (this.state.folders.length + 1) * 10,
                items: [],
            };
            this.state.folders.push(newFolder);
            this.state.expandedFolders[newFolder.id] = true;
        }

        this.closeFolderModal();
        await this.saveLayout();
    }

    async deletePersonalFolder(folderId) {
        const folder = this.state.folders.find(f => f.id === folderId);
        if (!folder || !folder.is_personal) return;

        const idx = this.state.folders.indexOf(folder);
        if (idx > -1) {
            this.state.folders.splice(idx, 1);
            await this.saveLayout();
        }
    }

    onFolderDragStart(ev, folder) {
        this.state.draggedFolder = folder;
        this.state.draggedItem = null;
        ev.dataTransfer.effectAllowed = "move";
    }

    async onFolderDrop(ev, targetFolder) {
        if (!this.state.draggedFolder || this.state.draggedFolder.id === targetFolder.id) return;

        const srcIdx = this.state.folders.findIndex(f => f.id === this.state.draggedFolder.id);
        const tgtIdx = this.state.folders.findIndex(f => f.id === targetFolder.id);

        if (srcIdx > -1 && tgtIdx > -1) {
            const [moved] = this.state.folders.splice(srcIdx, 1);
            this.state.folders.splice(tgtIdx, 0, moved);
            this.state.draggedFolder = null;
            await this.saveLayout();
        }
    }

    onItemDragStart(ev, folder, item) {
        this.state.draggedItem = item;
        this.state.draggedSourceFolder = folder;
        this.state.draggedFolder = null;
        ev.stopPropagation();
        ev.dataTransfer.effectAllowed = "move";
    }

    async onItemDropToFolder(ev, targetFolder) {
        ev.stopPropagation();
        if (!this.state.draggedItem || !this.state.draggedSourceFolder) return;

        const srcFolder = this.state.folders.find(f => f.id === this.state.draggedSourceFolder.id);
        const tgtFolder = this.state.folders.find(f => f.id === targetFolder.id);

        if (srcFolder && tgtFolder) {
            const srcIdx = srcFolder.items.findIndex(i => i.menu_id === this.state.draggedItem.menu_id);
            if (srcIdx > -1) {
                const [movedItem] = srcFolder.items.splice(srcIdx, 1);
                tgtFolder.items.push(movedItem);

                this.state.draggedItem = null;
                this.state.draggedSourceFolder = null;
                await this.saveLayout();
            }
        }
    }

    async saveLayout() {
        try {
            await this._callRpc("/vp_launcher/save_layout", {
                layout_data: {
                    folders: this.state.folders,
                    favorites: this.state.favorites,
                    recents: this.state.recents,
                }
            });
        } catch (e) {
            console.error("Failed to save launcher layout:", e);
        }
    }

    async resetLayout() {
        try {
            const res = await this._callRpc("/vp_launcher/reset_layout", {});
            this.state.folders = res.folders || [];
            this.state.favorites = res.favorites || [];
            this.state.recents = res.recents || [];
            const expanded = {};
            for (const f of this.state.folders) {
                expanded[f.id] = true;
            }
            this.state.expandedFolders = expanded;
        } catch (e) {
            console.error("Failed to reset layout:", e);
        }
    }
}

registry.category("actions").add("vp_user_app_menu.AppLauncher", AppLauncher);
