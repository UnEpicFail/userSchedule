/**
 * Модель дня пользователя
 * @type {*}
 */

var UserDayModel = Backbone.Model.extend({

    default:{
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
     */
    setBusyTime: function(s,e){
        console.log(this.id);

		var startPos = this.strToPos(s),    //получаем позицию бита начала, первая позиция 0 соответсвует ("00:00")
			endPos = this.strToPos(e),      //получаем позицию бита окончания, последняя позиция 47 соответсвует ("23:30")
            sum = 0;                        //перемення для подсчета суммы промежутка между s и e
		for (var i = startPos; i<=endPos; i+=1){
            sum |= 1 << i;                  //начиная с певогй позиции, с шагом в одну позицию смещаем еденицу и
                                            //прибавляем значение к ранее полученному
        }
                                            //прибавляем полученное значение к маске и применяем изменение
        this.set({timeMask:this.get('timeMask') | sum});

        console.log(this.get('timeMask'));
	},
    /**
     * Меняет маску "timeMask" таким образом чтобы между значениями "s" и "e" значение было 0
     * @param s - время начала "hh:mm", "00:00" - минимальное значение, "23:00" - максимальное, шаг = 30 минут
     * @param e - время окончания "hh:mm", "00:30" - минимальное значение, "23:30" - максимальное, шаг = 30 минут
     */
	setFreeTime: function(s,e){
        var startPos = this.strToPos(s),    //получаем позицию бита начала, первая позиция 0 соответсвует ("00:00")
            endPos = this.strToPos(e),      //получаем позицию бита окончания, последняя позиция 47 соответсвует ("23:30")
            sum = 0;                        //перемення для подсчета суммы промежутка между s и e
        for (var i = startPos; i<=endPos; i+=1){
            sum |= 1 << i;                  //начиная с певогй позиции, с шагом в одну позицию смещаем еденицу и
                                            //прибавляем значение к ранее полученному
        }
                                            //вычитаем  полученное значение из маски и применяем изменение
        this.set({timeMask:this.get('timeMask') ^ sum});

        console.log(this.get('timeMask'));
	},

    /**
     * Добавляем идентификатор конференции в список содержащий идентификаторы конференций
     * @param id - идентификатор конференции
     */
	addConference: function(id){
        var conferenceList = this.get('conferenceList');  //получаем список идентификаторов конференций пользователя
        console.log(conferenceList);
        if(!_.include(conferenceList,id)){                //если такого идентификатора еще нет
            conferenceList.push(id);                      //добавляем в конец списка идентификатор
            this.set({conferenceList:conferenceList});    //применяем изменения
        }

        console.log(this.get('conferenceList'));
	},
	
	removeConference: function(){

	},

    /**
     * Преобразует строку в позицию начиная от 0 до 43, позиция соответсвует времени от 00:00 до 23:30, с шагом в 30 минут
     * @param str - строка вида "hh:mm"
     * @return {Number} - позиция
     */
	strToPos: function(str){
        var arr = str.split(':');           //переобразуем строку в массив, развивая ее по знаку ":"
        return (parseInt(arr[0])*2 + ((parseInt(arr[1]) == 0)?0:1));
                                            // возвращаем значение равное удвоенному значению
                                            // часов + 1 или 0, в зависимости от того "ровный" час или нет.
    }

});

var ConferenceModel = Backbone.Model.extend({

    default:{
		timeMask:0,
		name:"",
		id:0
	},

	
	initialize: function(){
		this.id = this.cid
	}

});

var UserModel = Backbone.Model.extend({

    default:{
		id:0,
		name:""
	},
	
	initialize: function(){
		this.id = this.cid;
	},
	
	addUserDay: function(collection, data){
		var day = data.getDate(),
			month = data.getMonth(),
			year = data.getUTCFullYear();

        collection.addUserDay({
            accId : this.id,
            timeMask:0,
            day: day,
            month: month,
            year: year,
            week:getWeeksNum(year, month)
        });
	},

    getUserId: function(){
        return this.id;
    }

});

var UsersDaysCollection = Backbone.Collection.extend({

    model: UserDayModel,
	
	getDaysByDay: function(day, accId){
        var res = null;
        if(!accId)
            res = this.where({day:day});
        else
            res = this.where({day:day, accId:accId});

        return (res)?res:null;
	},
	
	getDaysByWeek: function(week, accId){
		var res = null;
        if(!accId)
            res = this.where({week:week});
        else
            res = this.where({week:week, accId:accId});

        return (res)?res:null;
	},

	getDaysByMonth: function(month, accId){
        var res = null;
        if(!accId)
            res = this.where({month:month});
        else
            res = this.where({month:month, accId:accId});

        return (res)?res:null;
	},

    getDaysById: function(id){
        var res = this.where({accId:id});
        return (res)?res:null;
    },

    addUserDay: function(obj){
        this.add(obj);
    }

}); 

var ConferenceCollection = Backbone.Collection.extend({

    model: ConferenceModel

});

var UsersCollection = Backbone.Collection.extend({

    model: UserModel,
	
	getUserByName: function(name){

        var res = this.where({name:name});
		if(res)
			return res[0];
		else 
			return null;
	}

});