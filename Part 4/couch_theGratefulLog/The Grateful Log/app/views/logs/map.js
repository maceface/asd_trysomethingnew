function (doc) {
	if (doc._id.substr(0, 7) === "logger:") {
		emit(doc._id, {
			"gDate": doc.gDate,
			"gWhat": doc.gWhat,
			"gColor": doc.gColor,
			"checked": doc.checked,
			"gTime": doc.gTime
		});
	}
};