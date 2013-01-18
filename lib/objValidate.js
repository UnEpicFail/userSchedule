function isObjValid(defaults, obj, type){
    if(type){
        for(var i in defaults){
            if(obj[i] == undefined)
                return false;
        }
        return true;
    }else{
        for(var i in obj){
            if(defaults[i] != undefined)
                return true;
        }
        return false;
    }

}