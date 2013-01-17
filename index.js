$(function(){
	var users = new UsersCollection([
		{
			name: "testUser 1"
		},
		{
			name: "testUser 2"
		}
	]),
	user = users.getUserByName('testUser 1'),
	userDay = new UsersDaysCollection();
	if(user)
		user.addUserDay(new Date());
	console.log(user);
	//user.setBusyTime('12:30','13:00');
	console.log(userDay.getDaysByWeek(5));
});