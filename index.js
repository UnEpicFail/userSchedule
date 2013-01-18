/*коллекции*/
var userDayCollection,
    usersCollection,
    conferenceCollection;

$(function(){
    var user,day;

    userDayCollection = new UsersDaysCollection();
    usersCollection = new UsersCollection();
    conferenceCollection = new ConferenceCollection();

    /*
    usersCollection.addUser({name:"testUser 1",email:'a@b.c',pass:123});
    usersCollection.addUser({name:"testUser 2",email:'e@b.c',pass:321});
    */

    /*
	user = usersCollection.getUserBy({name:'testUser 2'});
    console.log(user);
	if(user.errorCode == 0){
        user = user.value;
        if(user.length > 0){
            user = user[0];
            console.log(user.id);
            var addUserDay =userDayCollection.addUserDay(user.id, new Date())
            console.log(addUserDay);
            if(addUserDay.errorCode == 0){
                day = userDayCollection.getDaysBy({day:18,month:0});

                console.log(day);
                if(day.errorCode == 0){
                    day = day.value;
                    console.log(day);
                    if(day.length > 0){
                        console.log(day[0].setBusyTime("00:30","04:30"));

                        console.log(day[0].setFreeTime("02:30","03:00"));

                        console.log(day[0].addConference(12));
                        console.log(day[0].addConference(12));
                        console.log(day[0].addConference(13));
                        console.log(day[0].addConference(14));
                        console.log(day[0].removeConference(12));
                        console.log(day[0].addConference(12));
                        console.log(day[0].removeConference(16));
                    }
                }
            }
        }
    }
    */



    /*
    console.log(day[0]._changeTimeMask("00:30","04:30","Busy"));

    console.log(day[0]._changeTimeMask("02:30","03:00","Free"));

    day[0].addConference(12);
    day[0].addConference(13);
    day[0].addConference(14);
    day[0].addConference(15);
    day[0].addConference(12);
    day[0].removeConference(14);
    day[0].removeConference(16);
    day[0].addConference(14);
    */
});