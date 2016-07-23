var SquadMeet = (function(SMCore) {
    var TimeMap = {
        "YYYY": null, //long year number
        "YY": null, //short year number
        "MM": null, //long month number
        "M": null, //short month number
        "mm": null, //long month name,
        "m": null, //short month name
        "DD": null, //day number
        "DOW": null, //long day of week name
        "dow": null, //short day of week name
    }

    var Time = function(t) {
        if (!(this instanceof Time)) return new Time(t);
        this.time = new Date(t);
    }

    /* Get relative time */
    function from(t) {
        var t1 = this.time,
            t2;
        if (t) {
            t2 = (t instanceof Time) ? t.time : new Date(t);
        } else {
            t2 = new Date(); //use the current date
        }
        return new Time(t2 - t1);
    }

    /* Format the time */
    function format() {

    }

    /* Convert time to JSON savable format */
    function toJSON() {

    }

    Time.prototype = {
        from: from,
        format: null,
        toJSON: null
    }

    /* time range class */
    var TimeRange = function(s, e) {
        this.start = new Time(s);
        this.end = new Time(e);
    }

    TimeRange.prototype = {
        intersect: null,
        toJSON: null
    }

    /** HourGlass classs
    	or rather a container for
    	all the TimeRanges */
    var HourGlass = function(data) {
        if (!(this instanceof HourGlass)) return new HourGlass(data);
        this.data = [];
        this.addFromData(data);
    }

    function addFromData(d) {
    	for(var i=0;i<d.length;i++){
    		
    	}
    }

    HourGlass.prototype = {
        addFromData: addFromData
    }


    SMCore.classes = {
        Time: Time,
        TimeRange: TimeRange,
        HourGlass: HourGlass
    };

    return SMCore;
})(SquadMeet || {})