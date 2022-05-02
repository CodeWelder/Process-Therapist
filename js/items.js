
function Obj(num) {

	this.number = num;
	this.stats = [];
	this.container;
	//this.timer = 0;

};

function Resource(number, container) {
	
	this.number = number;
	this.container = container;
	this.line = []; //objects' storage

	// Work
	this.working_time = this.container.avg_time + 
	                    randomInt(-this.container.stdev_time, this.container.stdev_time);



	// Visuals
	this.draw_it = function(a, b, size) {
		
		// drawing params
		stroke(87);
		strokeWeight(1);
		fill(210);

		if (this.container.shape == 'ellipse') {
			ellipseMode(CENTER);
			ellipse(a, b, size, size);
		} else {
			rectMode(CENTER);
			rect(a, b, size, size);
		};
		
		//if (this.container.type == generator_) {
			// process' timer
			noStroke();
			textAlign(CENTER);
			fill(25);
			textSize(20);
			text(this.working_time, a, b + 25);
		//};

		if (this.container.type == process_ ||
			this.container.type == exit_) {
			// process' timer
			textAlign(CENTER);
			fill(25);
			textSize(20);
			text(this.line.length, a, b);
		};

	};



};	

//:::::::::::::::::::
// Generator class
//:::::::::::::::::::
function Generator() {
	
	this.shape = 'ellipse';
	//working params
	
	this.obj_numeration = 0;


	this.do_work = function() {
		
		for (var i = 0; i < this.resources.length; i++) {

			if (this.resources[i].working_time <= 0) {
			
				// create contract
				this.resources[i].line.push(new Obj(this.obj_numeration)); //SPECIAL

				// send contracts
				let l = Math.min(this.resources[i].line.length, this.max_stack);
				for (var j = 0; j < l; j++) {
					this.container.processes[this.number + 1].line.push(this.resources[i].line.shift());
					this.container.processes[this.number + 1].line[this.container.processes[this.number + 1].line.length - 1].stats.push(timer);
				};

				// set time for new contract
				this.resources[i].working_time = this.avg_time + randomInt(-this.stdev_time, this.stdev_time);
				this.obj_numeration += 1;                                  //SPECIAL

			} else {													   //SPECIAL

				this.resources[i].working_time -= 1;

			};
		};
	};

};
var generator_ = new Generator();

//:::::::::::::::::::
// Process class
//:::::::::::::::::::
function Process() {

	this.shape = 'rect';
	//working params

	this.do_work = function() {

		// process divades work for resources
		if (this.line.length > 0) {
			let l = this.line.length;
			for (var i = 0; i < l; i++) {
				let a = randomInt(0, this.resources.length-1);
				this.resources[a].line.push(this.line.shift());
			};
		};

		for (var i = 0; i < this.resources.length; i++) {

			if (this.resources[i].working_time <= 0 && this.resources[i].line.length > 0) {

				// send contracts
				let l = Math.min(this.resources[i].line.length, this.max_stack);
				for (var j = 0; j < l; j++) {
					this.container.processes[this.number + 1].line.push(this.resources[i].line.shift());
					this.container.processes[this.number + 1].line[this.container.processes[this.number + 1].line.length - 1].stats.push(timer);
				};

				// set time for new contract
				this.resources[i].working_time = this.avg_time + randomInt(-this.stdev_time, this.stdev_time);
				

			} else if (this.resources[i].line.length >= this.min_stack) {

				if (this.resources[i].working_time == 0) {
					// set time for new contract
					this.resources[i].working_time = this.avg_time + randomInt(-this.stdev_time, this.stdev_time);
				};
				this.resources[i].working_time -= 1;

			};
		};
	};

};
var process_ = new Process();

//:::::::::::::::::::
// Exit class
//:::::::::::::::::::
function Exit() {
	
	this.shape = 'ellipse';
	this.do_work = function() {
	// process divades work for resources
		if (this.line.length > 0) {
			let l = this.line.length;
			for (var i = 0; i < l; i++) {
				let a = randomInt(0, this.resources.length-1);
				this.resources[a].line.push(this.line.pop());
			};
		};
	};
};
var exit_ = new Exit();



function Stage(number, type, name, avg_time, stdev_time, max_stack, min_stack, res_amount) {

	this.name = name;
	this.number = number;
	this.avg_time = avg_time;
	this.stdev_time = stdev_time;
	this.max_stack = max_stack;
	this.min_stack = min_stack;
	this.type = type;
	// create resources
	this.init_res = function(res_amount) {
		let result = [];
		for (var i = 0; i < res_amount; i++) {
			result.push(new Resource(i, this));
		};
		return result;
	};
	this.resources = this.init_res(res_amount);
	
	this.container;
	this.line = [];

	//visual options
	this.size = 50;
	this.x_coord;

	this.draw_it = function() {

		this.x_coord = (this.number + 0.5) * (window.innerWidth / this.container.processes.length);
		
		// base drawing b coord
		var b = window.innerHeight * 0.8 / this.resources.length;
		
		for (var i = 0; i < this.resources.length; i++) {
			
			let b0 = window.innerHeight * 0.1 + (i + 0.5)*b ;
			this.resources[i].draw_it(this.x_coord, b0, this.size);
		};

	};

	this.__proto__ = type;

};


function Project(name, processes){
	this.name = name;
	this.processes = processes;

	this.draw_it = function() {
		
		textAlign(CENTER);
		textStyle(BOLD);
		textSize(20)
		strokeWeight(1);
		fill(25);
		text(this.name, window.innerWidth/2, window.innerHeight * 0.05);

		// draw lines and names
		for (var i = 0; i < this.processes.length; i++) {
			// lines
			let a = window.innerWidth / this.processes.length;
			let a0 = a * (i+1);
			let b0 = window.innerHeight * 0.1;
			let a1 = a * (i+1);
			let b1 = window.innerHeight * 0.9;
			stroke(87);
			line(a0, b0, a1, b1);

			// processes' names
			noStroke();
			textAlign(CENTER);
			textStyle(BOLD);
			fill(25);
			textSize(12);
			text(this.processes[i].name, a0 - a/2, b0);
		};

		// draw processes
		for (var i = 0; i < this.processes.length; i++) {
			this.processes[i].draw_it();
		};
	};

	this.connect = function() {

		for (var i = 0; i < this.processes.length; i++) {
			this.processes[i].container = this;
		};
		
	};
};

// Math extention
function randomInt(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
};