class Container {
    constructor({ title, code }){
        this.displayName = 'Container';
        this.title = title;
        this.code = code;

        // timestamp will be settled at load Container method
        this.timestamp = null;
    }

    execute({baseWindowTitle, root}){
        let callback = this.code;

        let titleElement = root.children[0];
        titleElement.textContent = this.title;
        
        document.title = baseWindowTitle + ' - ' + this.title;

        // execute container code
        callback(root);
    }
}