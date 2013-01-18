function validate(here, it, as){
    for(var i in here){
        if((it[i] == undefined) ^ as)
            return as;
    }
    return !as;
}