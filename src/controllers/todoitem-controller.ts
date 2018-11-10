import { Controller } from "stimulus";

export default class TodoItemController extends Controller {
    public static targets: string[] = ["valueLabel", "valueEditor", "completed"];

    protected readonly valueLabelTarget!: HTMLLabelElement;
    protected readonly valueEditorTarget!: HTMLInputElement;
    protected readonly completedTarget!: HTMLInputElement;

    public connect() {
        // sync up the 'complete' class and the checkbox state
        if (this.completedTarget.checked) {
            this.completed = true;
        } else if (this.completed) {
            this.completedTarget.checked = true;
        }
    }

    public get visible() {
        return this.element.classList.contains("hidden");
    }

    public set visible(value: boolean) {
        this.element.classList.toggle("hidden", !value);
    }

    public get value() {
        if (this.editing) {
            return this.valueEditorTarget.value.trim();
        } else if (this.valueLabelTarget.textContent) {
            return this.valueLabelTarget.textContent.trim();
        }
    }

    public set value(v) {
        this.valueEditorTarget.value = this.valueLabelTarget.textContent =
            (v && v.trim()) || "";
    }

    public get editing() {
        return this.element.classList.contains("editing");
    }

    public set editing(value: boolean) {
        this.element.classList.toggle("editing", value);
        if (value) {
            this.valueEditorTarget.focus();
        }
    }

    public edit() {
        this.editing = true;
    }

    public unedit() {
        this.editing = false;
    }

    public get completed() {
        return this.element.classList.contains("completed");
    }

    public set completed(value: boolean) {
        this.element.classList.toggle("completed", value);
        this.element.dispatchEvent(new CustomEvent("itemchanged"));
    }

    public toggleCompleted() {
        this.completed = !this.completed;
    }

    public destroy() {
        const { parentElement } = this.element;
        this.element.remove();
        if (parentElement) {
            parentElement.dispatchEvent(new CustomEvent("itemdestroyed"));
        }
    }
}
