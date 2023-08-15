import { IInputs, IOutputs } from "./generated/ManifestTypes";

interface PopupDev extends ComponentFramework.FactoryApi.Popup.Popup {
    popupStyle: object;
}

export class PopUpOppener implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _context: ComponentFramework.Context<IInputs>;
    private button: HTMLElement;
    private popUpService: ComponentFramework.FactoryApi.Popup.PopupService;
    private div: HTMLElement;
    private popUpContainer: HTMLElement;
    private popUpContent: HTMLElement;
    private closeDiv: HTMLElement;

    constructor() {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this.div = document.createElement("div");
        this.button = document.createElement("input");

        this.button.classList.add("btn");
        this.button.setAttribute("type", "button");
        this.button.style.width = (context.parameters.ButtonWidth.raw || 100).toString() + "px";
        this.button.style.height = (context.parameters.ButtonHeight.raw || 20).toString() + "px";
        this.button.style.backgroundColor = context.parameters.Color.raw || "blue";
        this.button.setAttribute("value", context.parameters.Text.raw?.toString() || '');


        this.button.onclick = () => { this.OpenPopUp() };

        this.div.appendChild(this.button);
        container.appendChild(this.div);



        ////////////////////////////POPUP/////////////////////////////
        this.popUpService = context.factory.getPopupService();
        this.popUpContainer = document.createElement('div');
        this.popUpContent = document.createElement('div');

        this.popUpContainer.classList.add("container-fluid");

        this.popUpContent.classList.add("row");

        this.popUpContainer.appendChild(this.popUpContent);

        // popUpContent.innerHTML = '<div id="PopUp"></div>';
        this.popUpContent.style.width = (context.parameters.PopUpWidth.raw || 200).toString() + "px";
        this.popUpContent.style.height = (context.parameters.PopUpHeight.raw || 100).toString() + "px";
        this.popUpContent.style.backgroundColor = "white";

        this.closeDiv = document.createElement("div");
        this.closeDiv.classList.add("col-12");
        let closebutton = document.createElement("button");
        closebutton.setAttribute("id", "closebtn");
        closebutton.style.background = "transparent";
        closebutton.style.border = "none";
        closebutton.style.float = "right";
        closebutton.innerHTML = " X ";
        this.closeDiv.appendChild(closebutton);

        //this.popUpContainer.appendChild(closeDiv);
        //let popUpContent = this.popUpContent;
        let popUpContainer = this.popUpContainer;

        // var xhtml = new XMLHttpRequest();
        // xhtml.onreadystatechange = function () {
        //     if (this.status == 200) { popUpContent.innerHTML = this.responseText; }
        //     if (this.status == 404) { popUpContent.innerHTML = "Page not found."; }
        // }
        // xhtml.open("GET", context.parameters.Link.raw || "html/EmptyLink.html", false);
        // xhtml.send();

        let popUpOptions: PopupDev = {
            closeOnOutsideClick: true,
            content: popUpContainer,
            name: 'Popup', // unique popup name
            type: 1, // Root popup
            popupStyle: {
            }
        };

        this.popUpService.createPopup(popUpOptions);

    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Add code to update control view
        this._context = context;
        this.button.style.width = (context.parameters.ButtonWidth.raw || 200).toString() + "px";
        this.button.style.height = (context.parameters.ButtonHeight.raw || 50).toString() + "px";
        this.button.style.backgroundColor = context.parameters.Color.raw || "blue";
        this.button.setAttribute("value", context.parameters.Text.raw?.toString() || '');
        // popUpContent.innerHTML = '<div id="PopUp"></div>';
        this.popUpContent.style.width = (context.parameters.PopUpWidth.raw || 200).toString() + "px";
        this.popUpContent.style.height = (context.parameters.PopUpHeight.raw || 100).toString() + "px";
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }


    public OpenPopUp(): void {

        let popUpContent = this.popUpContent;


        var xhtml = new XMLHttpRequest();
        let temp = document.createElement("div");
        temp.appendChild(this.closeDiv);
        popUpContent.innerHTML = temp.innerHTML;
        temp.remove();
        xhtml.onreadystatechange = function () {
            if (this.status == 200) { popUpContent.innerHTML += "<div class='col-12'>" + this.responseText + "</div>"; }
            if (this.status == 404) { popUpContent.innerHTML += "<div class='col-12'>" + "Page not found." + "</div>"; }
        }
        xhtml.open("GET", this._context.parameters.Link.raw || "html/EmptyLink.html", false);
        xhtml.send();

        this.popUpService.openPopup("Popup");

        var popUpParent = document.querySelector("[openedpopups='.Popup']")?.firstElementChild?.firstElementChild;
        if (popUpParent) {
            popUpParent.classList.add("justify-content-center");
            popUpParent.classList.add("align-items-center");
        }

        var btn = document.getElementById("closebtn")
        if (btn)
            btn.onclick = () => this.popUpService.closePopup("Popup");
    }
}
