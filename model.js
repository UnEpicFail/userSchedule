/**
 * Модель дня пользователя
 * @type {*}
 */

var UserDayModel = Backbone.Model.extend({

    defaults:{
        id:0,               //идентификатор дня
        timeMask:0,         //маска занятого времени
		accId:0,            //идентификатор аккаунта которому пренадлежит день
		day:0,              //номер дня (в рамках месяца)
		month:0,            //номер месяца (начиная с нуля)
		week:0,             //номер недели (с начала года)
		year:0,             //год (ГГГГ)
		conferenceList:[]   //список идентификаторов конференций в которых учавствует аккаунт
	},

    initialize: function(){
        this.id = this.cid; //пока нет нормальных идентификаторов
    },

    /**
     * Меняет маску "timeMask" таким образом чтобы между значениями "s" и "e" значение было 1
     * @param s - время начала "hh:mm", "00:00" - минимальное значение, "23:00" - максимальное, шаг = 30 минут
     * @param e - время окончания "hh:mm", "00:30" - минимальное значение, "23:30" - максимальное, шаг = 30 минут
     *
     * @return {Object} - объек вида:
     *                     {
     *                          errorCode - код ошибки (0 если все хорошо)
     *                          value - результат выполнения, либо пустая строка, либо текст ошибки
     *                     }
     */
    setBusyTime: function(s,e){
       return this._changeTimeMask(s,e,"Busy");//возвращаем результат выполнения функции
	},

    /**
     * Меняет маску "timeMask" таким образом чтобы между значениями "s" и "e" значение было 0
     * @param s - время начала "hh:mm", "00:00" - минимальное значение, "23:00" - максимальное, шаг = 30 минут
     * @param e - время окончания "hh:mm", "00:30" - минимальное значение, "23:30" - максимальное, шаг = 30 минут
     *
     * @return {Object} - объек вида:
     *                     {
     *                          errorCode - код ошибки (0 если все хорошо)
     *                          value - результат выполнения, либо пустая строка, либо текст ошибки
     *                     }
     */
	setFreeTime: function(s,e){
        return this._changeTimeMask(s,e,"Free");//возвращаем результат выполнения функции
	},


    /**
     * Меняет маску "timeMask" таким образом чтобы между значениями "s" и "e" значение было либо 0, либо 1
     * в зависимости от параметра type
     * @param s - время начала "hh:mm", "00:00" - минимальное значение, "23:00" - максимальное, шаг = 30 минут
     * @param e - время окончания "hh:mm", "00:30" - минимальное значение, "23:30" - максимальное, шаг = 30 минут
     * @param type - тип действия либо "Busy" - меняем на 1, либо "Free" - меняем на 0
     *
     * @return {Object} - объек вида:
     *                     {
     *                          errorCode - код ошибки (0 если все хорошо)
     *                          value - результат выполнения, либо пустая строка, либо текст ошибки
     *                     }
     */
    _changeTimeMask:function(s,e,type){
        var res = {                             //возвращаемый объект
            errorCode:0,                        //код ошибки
            value:''                            //значение результата
        };

        //если входные данные есть и они строки
        if(typeof s == "string" && typeof e == "string"){
            var startPos = this.strToPos(s),    //получаем позицию бита начала, первая позиция 0 соответсвует ("00:00")
                endPos = this.strToPos(e),      //получаем позицию бита окончания, последняя позиция 47 соответсвует ("23:30")
                sum = 0;                        //перемення для подсчета суммы промежутка между s и e

                                                //если удалось получить позиции без ошибок
            if(startPos.errorCode == 0 && endPos.errorCode == 0){

                for (var i = startPos.value; i<=endPos.value; i+=1){
                    sum |= 1 << i;              //начиная с певогй позиции, с шагом в одну позицию смещаем еденицу и
                                                //прибавляем значение к ранее полученному
                }
                if(type == 'Free'){
                                                //вычитаем  полученное значение из маски и применяем изменение
                    this.set({timeMask:this.get('timeMask') ^ sum});
                }else if(type == 'Busy'){
                                                //прибавляем полученное значение к маске и применяем изменение
                    this.set({timeMask:this.get('timeMask') | sum});
                }
            }else{
                res = {                         //если не удалось получить позицию из входных параметров
                                                //собираем объект ошибки с кодом 2
                    errorCode:2,
                    value: 'Invalid '+((startPos.errorCode != 0)?'start time value ':'') +
                        ((endPos.errorCode != 0)?(((startPos.errorCode != 0)?'and ':'')+'end time value'):'')
                }
            }
        }else{
            res = {                             //если входные параметры не валидны собираем объект с кодом ошибки 1
                errorCode:1,
                value: 'Invalid input parameter'
            }
        }

        console.log(this.get('timeMask'));

        return res;                             //возвращаем результат выполнения функции
    },

    /**
     * Добавляем идентификатор конференции в список содержащий идентификаторы конференций
     * @param id - идентификатор конференции
     *
     * @return {Object} - объек вида:
     *                     {
     *                          errorCode - код ошибки (0 если все хорошо)
     *                          value - результат выполнения, либо пустая строка, либо текст ошибки
     *                     }
     */
	addConference: function(id){
        return this._changeConferenceList(id, 'add');                //возвращаем результат выполнения функции
	},

    /**
     * Удаляет переданный элемент из списка
     * @param id - идентификатор для удаления его из списка
     *
     * @return {Object} - объек вида:
     *                     {
     *                          errorCode - код ошибки (0 если все хорошо)
     *                          value - результат выполнения, либо пустая строка, либо текст ошибки
     *                     }
     */
	removeConference: function(id){
       return this._changeConferenceList(id, 'remove');              //возвращаем результат выполнения функции
	},


    /**
     * Меняет список идентификаторов конференций в зависимости от параметра type
     * @param id - идентификатор для удаления его из списка
     * @param type - тип действия со списком идентификаторов конференций. "add" - добавить идентификатор в список
     *                                                                    "remove" - удалить идентификатор из списка
     * @return {Object} - объек вида:
     *                     {
     *                          errorCode - код ошибки (0 если все хорошо)
     *                          value - результат выполнения, либо пустая строка, либо текст ошибки
     *                     }
     * @private
     */
    _changeConferenceList: function(id,type){
        var res = {                                             //возвращаемый объект
            errorCode:0,                                        //код ошибки
            value:''                                            //значение результата
        }

        if(id != null && id != undefined){                      //если переданный параметр есть

                                                                //получаем список идентификаторов конференций пользователя
            var conferenceList = this.get('conferenceList');

                                                                //если полученный список массив с длиной больше нуля
            if(typeof conferenceList == 'object' && conferenceList.length >= 0){
                if(type == 'remove'){                           //если тип удалить

                                                                //если переданный идентификатор есть в списке
                    if(_.contains(conferenceList, id)){

                                                                //удаляем идентификатор из списка
                        conferenceList.splice(conferenceList.indexOf(id),1);
                    }else{                                      //если переданного идентификатора нет в списке
                        res = {                                 //собираем объект ошибки с кодом 3
                            errorCode:4,
                            value: 'No such id in conference list'
                        }
                    }
                }else if(type == 'add'){                        //если тип добавить
                    if(!_.include(conferenceList,id)){          //если такого идентификатора еще нет
                        conferenceList.push(id);                //добавляем в конец списка идентификатор

                    }else{                                      //если такой идентификаторо есть
                        res = {                                 //собираем объект ошибки с кодом 2
                            errorCode:3,
                            value: 'Such id is already exist'
                        }
                    }
                }
                this.set({conferenceList:conferenceList});      //применяем изменения
            }else{                                              //если не удалось получить список идентификаторов концеренции
                res = {                                         //собираем объект с кодом ошибки 2
                    errorCode:2,
                    value: 'failed to obtain conference list'
                }
            }
        }else{
            res = {                                             //если входной параметр не валиден собираем объект с кодом ошибки 1
                errorCode:1,
                value: 'Invalid input parameter'
            }
        }

        console.log(this.get('conferenceList'))

        return res;                                             //возвращаем результат выполнения функции
    },

    /**
     * Преобразует строку в позицию начиная от 0 до 43, позиция соответсвует времени от 00:00 до 23:30, с шагом в 30 минут
     * @param str - строка вида "hh:mm"
     * @return {Object} -  объек вида:
     *                     {
     *                          errorCode - код ошибки (0 если все хорошо)
     *                          value - результат выполнения, либо пустая строка, либо текст ошибки
     *                     }
     */
	strToPos: function(str){
        var res = {                         //возвращаемый объект
            errorCode:0,                    //код ошибки
            value:''                        //значение результата
        }

        if(typeof str == 'string'){         //если входной параметр строка
            var arr = str.split(':');       //переобразуем строку в массив, развивая ее по знаку ":"
                                            //если полуцился массив c колличеством элементов 2,
                                            // в котором каждый элемент строка и меет по 2 элемента
            if(arr.length == 2 && arr[0].length == 2 && arr[1].length == 2){
                                            // записываем значение равное удвоенному значению
                                            // часов + 1 или 0, в зависимости от того "ровный" час или нет.
                res.value = (parseInt(arr[0])*2 + ((parseInt(arr[1]) == 0)?0:1))
            }else{                          //если arr не соответсвует условию со,ираем объект ошибки с кодом 2
                res = {
                    errorCode:2,
                    value: 'Invalid input string'
                }
            }
        }else{                              //если входной параметр не строка собираем объект ошибки с кодом 1
            res = {
                errorCode:1,
                value: 'Invalid input object'
            }
        }

        return res;                          //возвращаем результат выполнения функции
    }

});

var ConferenceModel = Backbone.Model.extend({

    defaults:{
        id:0,
        ownerId:0,
        name:'',
        status:'',
        data:{},
		timeMask:0,
        invited:[],
        description:'',
        files:[]
	},

	
	initialize: function(){
		this.id = this.cid
	}

});

var UserModel = Backbone.Model.extend({

    defaults:{
		id:0,                    //идентификатор пользователя
		name:'',                 //имя пользователя
        email:'',                //email пользователя
        passHash:''              //хэш пароля
	},
	
	initialize: function(){
		this.id = this.cid; //пока нет нормальных идентификаторов
	}
});

var UsersDaysCollection = Backbone.Collection.extend({

    model: UserDayModel,

    /**
     * Ищет дни по входням параметрам
     * @param obj - объект по которому будет осуществлятся поиск. Обязан содержать минимум один из критереив поиска:
     *              day - дата дня в месяце;
     *              week - номер недели с начала года;
     *              month - номер месяца (0-январь);
     *              year - номер года "ГГГГ";
     *              accId - идентефикатор пользователя.
     *
     *              пример объекта:
     *                  {
     *                      day:18,
     *                      month:0,
     *                      year:2013,
     *                      accId: 1234
     *                  }
     *              вернет массив содержащий день 18 января 2013 года от пользователя 1234, если он есть.
     * @return {Object} - объек вида:
     *                     {
     *                          errorCode - код ошибки (0 если все хорошо)
     *                          value - результат выполнения: либо массив содержащий найденные
     *                                 дни (пустой массив если ни одного дня не найдено), либо текст ошибки
     *                     }
     */
    getDaysBy: function(obj){
        var res = {                             //возвращаемый объект
            errorCode:0,                        //код ошибки
            value:[]                            //значение результата
        };

                                                //если переданный данные есть и это объект
        if(obj != null && typeof obj == 'object'){
                                                //если переданный объект содержит хотябы одно валидное поля для поиска
            if (isObjValid(this.model.prototype.defaults, obj)){
                res.value = this.where(obj);   //ищим по данным из переданного объекта и записываем в опле value
            }else{                              //если переданный объект не содержит нужных параметров
                res = {                         //собираем объект ошибки с  кодом 2
                    errorCode:2,
                    value: 'Not enough or invalid options'
                }
            }
        }else{                                  //если переданный объект не валиден
            res = {                             //собираем объект ошибки с  кодом 1
                errorCode:1,
                value: 'Invalid input parameter'
            }
        }
        return res;                             //возвращаем резальтат
    },

    /**
     * Добавляет день в переданнйю коллексцию с добавлением идентификатора пользователя в этот день
     * @param id - идентификатор пользователя для которого создается день
     * @param data - js объект дня который надо добавить
     *
     * @return {Object} -  объек вида:
     *                     {
     *                          errorCode - код ошибки (0 если все хорошо)
     *                          value - результат выполнения, либо созданный день, либо текст ошибки
     *                     }
     */
    addUserDay: function(id, data){
        var res = {                                         //возвращаемый объект
            errorCode:0,                                    //код ошибки
            value:''                                        //значение результата
        }

                                                            //если все необходимые данные есть
        if(id != null && id != undefined && data != null && typeof data == 'object'){
            var day = data.getDate(),                       //получаем день
                month = data.getMonth(),                    //получаем номер месяца (0-январь)
                year = data.getUTCFullYear(),               //получаем полную дату вида "ГГГГ"
                mod = new this.model({                      //создаем день на основе модели дня
                    accId :id,                              //идентификатор пользователя к которому добавляется день
                    timeMask:0,                             //маска занятого времени
                    day: day,                               //вычесленный день
                    month: month,                           //вычесленный месяц
                    year: year,                             //вычесленный год
                    week:getWeeksNum(year, month),          //вычесняем номер недели начиная с начала года
                    conferenceList:[]                       //пустой список идентификаторов конференций на этот день
                });

            this.add(mod);                                  //добавляем в коллекцию день с ранее вычесленными параметрами
            res.value = mod;                                //возвращаем созданный день

        }else{                                              //если переданные параметры не валидны
            res = {                                         //собираем объект с кодом ошибки 1
                errorCode: 1,
                value: 'Invalid input parameter'
            }
        }

        return res;                                         //возвращаем результат выполнения функции
    }

}); 

var ConferenceCollection = Backbone.Collection.extend({

    model: ConferenceModel


});

var UsersCollection = Backbone.Collection.extend({

    model: UserModel,

    /**
     * Создание пользователя
     * @param obj - объект содержащий данные для создания пользователя, поля email и pass - обязательны
     * @return {Object}-  объек вида:
     *                     {
     *                          errorCode - код ошибки (0 если все хорошо)
     *                          value - результат выполнения, созданный пользователь, либо текст ошибки
     *                     }
     */
    addUser: function(obj){
        var res = {                                         //возвращаемый объект
            errorCode:0,                                    //код ошибки
            value:''                                        //значение результата
        }

        if(obj != null && typeof obj == 'object'){
                                                            //если переданный объект содержит хотябы одно валидное
                                                            //поле для создания пользователя
            if (isObjValid({email:'',pass:''}, obj, true)){
                if(this.getUserBy({email:obj.email}).value.length == 0){     //если пользователя с таким email еще нет
                    obj.passHash = obj.pass;                //здеть надо применить кодирование
                    var mod = new this.model(obj);          //создаем объект на основе модели
                    this.add(mod);                          //создаем нового пользователя из созданного объекта
                    res.value = mod;                        //возвращаем созданного пользователя
                }else{
                    res = {                                 //если пользователь с таким email уже есть
                        errorCode: 3,
                        value: 'User with such email exist'
                    }
                }
            }else{                                          //если указаны не все нужные параметры
                res = {
                    errorCode: 2,
                    value: 'Invalid option'
                }
            }
        }else{                                              //если переданный параметр не валиден
            res = {                                         //собираем объект с кодом ошибки 1
                errorCode: 1,
                value: 'Invalid input parameter'
            }
        }

        return res;
    },


    /**
     * Поиск пользователя по данным с которыми он логинится
     * @param obj - объект содержащий данные для поиска, поля email и pass - обязательны
     * @return {Object} -  объек вида:
     *                     {
     *                          errorCode - код ошибки (0 если все хорошо)
     *                          value - результат выполнения, массив с пользователем, либо текст ошибки
     *                     }
     */
    getUserByLoginDate: function(obj){
        var res = {                                         //возвращаемый объект
            errorCode:0,                                    //код ошибки
            value:''                                        //значение результата
        }
        if(obj != null && typeof obj == 'object' ){
            if(isObjValid({email:'',pass:''},obj, true)){   //проверяем наличие нужных параметров email и pass
                obj.passHash = obj.pass;                    //здеть надо применить кодирование
                res.value = this.where(obj);                //ищим пользователя
            }else{                                          //если указаны не все нужные параметры
                res = {
                    errorCode: 2,
                    value: 'Invalid option'
                }
            }
        }else{                                              //если переданный параметр не валиден
            res = {                                         //собираем объект с кодом ошибки 1
                errorCode: 1,
                value: 'Invalid input parameter'
            }
        }

        return res;                                         //возвращаем результат выполнения функции
    },

    /**
     * Поиск пользоватаелей по входным параметрам
     * @param obj - бъект по которому будет осуществлятся поиск. Обязан содержать минимум один из критереив поиска:
     *              id - идентивикатор пользователя;
     *              name - имя пользователя.
     *
     *              пример объекта:
     *                  {
     *                      id: 1234
     *                  }
     *              вернет массив содержащий пользователя с идентификатором 1234, если он есть.
     * @return {Object} - объек вида:
     *                     {
     *                          errorCode - код ошибки (0 если все хорошо)
     *                          value - результат выполнения: либо текст ошибки, либо массив
     *                     }
     */
	getUserBy: function(obj){
        var res = {                             //возвращаемый объект
            errorCode:0,                        //код ошибки
            value:''                            //значение результата
        };
                                                //если переданный параметр есть и это объект
        if(obj != null && typeof obj == 'object'){

            if (isObjValid(this.model.prototype.defaults, obj)){      //если переданный объект содержит хотябы одно валидное поля для поиска
                res.value = this.where(obj);
            }else{                              //если переданный объект не содержит поелй для поиска
                res = {                         //собираем объект ошибки с  кодом 2
                    errorCode:2,
                    value: 'Not enough or invalid options'
                }
            }
        }else{                                  //если переданный параметр не валиден
            res = {                             //собираем объект ошибки с  кодом 1
                errorCode:1,
                value: 'Invalid input parameter'
            }
        }

        return res;                             //возвращаем результат действия функции
	}

});