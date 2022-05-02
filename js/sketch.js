
//::: Sizes and indents


//::: Objects
/*// create sqwr map with mape_size side
	var mape = new Map(mape_size);
	// create interface
	var side_menu = new Side_menu(grid_intFace_size);
*/

// redraw if equals 1
var redr = 1;
var timer_on = -1;
var timer = 0;
// Creating processes
//var proc_0 = ;


// Creating project with processes in it
var proj_0 = new Project('Contract checking', [
	//number, type, name, avg_time, stdev_time, max_stack, min_stack, res_amount
	new Stage(0, generator_, 'Purchaser', 180, 60, 1, 0, 5),
	new Stage(1, process_, 'Assignment', 60, 15, 100, 0, 1),
	new Stage(2, process_, 'Checking', 60, 30, 1, 1, 3),
	new Stage(3, process_, 'Signing', 60, 15, 100, 0, 1),
	new Stage(4, exit_, 'Exit', 0, 0, 0, 0, 1)
]);
proj_0.connect();

//::: P5 setup
	var canvas;

function setup() {


	canvas = createCanvas(windowWidth, windowHeight * 0.9);
	canvas.position(0, 52);                                  ///RRRR
	//createElement('h1', "I am a paragraph!");
	//background(220);
	pixelDensity(1);

};


//textAlign(CENTER);

function draw() {

	if (keyIsDown(RIGHT_ARROW) || timer_on == 1) {

		timer += 1;
		redr = 1;

		for (let element of proj_0.processes) {

			element.do_work();

		};
		//proj_0.processes[0].do_work();

	};


	if (redr == 1) {

		// draw background
		loadPixels();
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {

				let index = (x + y * width) * 4;

				pixels[index] = 0;
				pixels[index+1] = 134;
				pixels[index+2] = 205;
				pixels[index+3] = round((y*255)/height);
			}
		}
		updatePixels();


		proj_0.draw_it();

		//timer
		textAlign(CENTER);
		textSize(20)
		strokeWeight(1);
		fill(25);
		text('Timer: ' + timer, windowWidth * 0.95, windowHeight * 0.05);

		redr = 0;
	};

};


function write_to_file() {

	var table = [];
	var line_ = proj_0.processes[proj_0.processes.length - 1].resources[0].line;
	for (var i = 0; i < line_.length - 1; i++) {
		var result = line_[i].number + ';';
		for (var j = 0; j < line_[i].stats.length; j++) {
			result = result + line_[i].stats[j] + ';';
		};
		table.push(result);
	};
	saveStrings(table, 'table.txt');
};


function keyPressed() {
	if (keyCode == 32) {
		timer_on = timer_on * -1;
	};

	if (keyCode == 40) {
		write_to_file();
	};
	return false; // prevent default
};
