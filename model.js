var UserDayModel = Backbone.Model.extend({
	default:{
		timeMask:0,
		accId:0,
		day:0,
		month:0,
		week:0,
		year:0,
		conferenceList:[]
	},
	
	setBusyTime: function(s,e){
		var startTime = this.strToPos(s),
			endTime = this.strToPos(e);
			console.log('startTime '+startTime);
			console.log('endTime '+endTime);
	},
	
	setFreeTime: function(){
	},
	
	addConference: function(){
	},
	
	removeConference: function(){
	},
	
	strToPos: function(str){
		var arr = str.split(':');
		return (parceInt(arr[0])*2 + ((parceInt(arr[1]) == 0)?0:1));
	}
});

var ConferenceModel = Backbone.Model.extend({
	default:{
		tymeMask:0,
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
	
	addUserDay: function(data){
		var day = data.getDate(),
			month = data.getMonth(),
			year = data.getUTCFullYear(),
			userDay = new UsersDaysCollection({
				accId : this.id,
				tymeMask:0,
				day: day,
				month: month,
				year: year,
				week:getWeeksNum(year, month)
			});
			console.log('year '+year)
	}
});

var UsersDaysCollection = Backbone.Collection.extend({
	model: UserDayModel,
	
	getDaysByDay: function(day){
	},
	
	getDaysByWeek: function(week){
		var res = this.where({week:week});
		if(res)
			return res;
		else 
			return null;
	},
	
	getDayByMonth: function(week){
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