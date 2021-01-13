import ActorCreator from "./actorCreator.js";

export default class ImportWindow extends Application {

    static get defaultOptions() {
        return {
            ...super.defaultOptions,
            id: "md-importer",
            template: "modules/dhole-importer/templates/importer.html",
            resizable: true,
            height: "auto",
            width: 400,
            minimizable: true,
            title: "Character Importer"
        }
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find("#submit-import").click(async ev => {
            try {

                let fe = html.find("[name=file]");
                if (fe[0].files[0] === undefined) {
                    ui.notifications.error("Please select file to import")
                }
                
                const importedData = await fe[0].files[0].text();
                ActorCreator.actorCreator(importedData);
                this.close();

            } catch (e) {
                ui.notifications.error("Error Importing: " + e)
            }
        })

    }
}