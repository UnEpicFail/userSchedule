function getWeeksNum(year, month) {
    var daysNum = 32 - new Date(year, month, 32).getDate(),
        fDayO = new Date(year, month, 1).getDay(),
        fDay = fDayO ? (fDayO - 1) : 6,
        weeksNum = Math.ceil((daysNum + fDay) / 7);
		console.log("weeksNum = "+weeksNum);
    return weeksNum;
}