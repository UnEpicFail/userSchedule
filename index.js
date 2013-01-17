var day;
$(function(){
	var userDayCollection = new UsersDaysCollection(),
        usersCollection = new UsersCollection([
		{
			name: "testUser 1"
		},
		{
			name: "testUser 2"
		}
	]),
	user = usersCollection.getUserByName('testUser 1');

	if(user)
	    user.addUserDay(userDayCollection, new Date());


    day = userDayCollection.getDaysByDay(17);
    console.log(day);
    day[0].setBusyTime("00:30","04:30");
    day[0].setFreeTime("02:30","03:00");
});