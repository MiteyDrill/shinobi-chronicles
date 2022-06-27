class Generation {

    constructor(){
        this.generation_array = []; //NameTag list
        this.generation_number = 0; //generation number (0) is root
    }

    /**
     * 
     * @param {NameTag} nameTag 
     */
    addNode(nameTag){
        this.generation_array.push(nameTag);
    }

    /**
     * 
     * @returns {list} list of Nametags
     */
    array(){
        return this.generation_array;
    }

    editNode(){}
    deleteNode(){}
}

export { Generation };