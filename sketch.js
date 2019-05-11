// Medica Robotics Project 
// C A S v 4.13.2
// Kanan Rahimli
// 11 - 5 - 19
// Sapienza University, Rome


// loads the offline data separately from the code, for safety and performance purposes, all loyalty free data (except the music)
function preload() {
	j1 = loadJSON('database/scenario_1.json');
	j2 = loadJSON('database/scenario_2.json');
	j3 = loadJSON('database/scenario_3.json');
	fontQuivira = loadFont('assets/fonts/Quivira.otf');
	sapienza_logo = loadImage('assets/logos/sapienza_logo.jpg');
	correct_ans_sound = loadSound('assets/audios/correct_ans_sound.wav');
	wrong_ans_sound = loadSound('assets/audios/wrong_ans_sound.wav');
	opinion_ans_sound = loadSound('assets/audios/opinion_ans_sound.wav');
	// "Kiss the Rain" by "Yiruma"
	background_music = loadSound('assets/audios/background_music.mp3');
	instructions_texture = loadImage('assets/others/instructions.png');
	texture_sun = loadImage('assets/planets/sun.png');
	texture_mercury = loadImage('assets/planets/mercury.png');
	texture_venus = loadImage('assets/planets/venus.png');
	texture_earth = loadImage('assets/planets/earth.png');
	texture_mars = loadImage('assets/planets/mars.png');
	texture_jupiter = loadImage('assets/planets/jupiter.png');
	texture_saturn= loadImage('assets/planets/saturn.png');
	texture_uranus = loadImage('assets/planets/uranus.png');
	texture_neptune = loadImage('assets/planets/neptune.png');
	texture_pluto = loadImage('assets/planets/pluto.png');
}

// setting up the global variables, initials and the parameters
function setup() {
	// support for WEBGL, 3d mode
	createCanvas(innerWidth, innerHeight, WEBGL);
	ortho();
	
	data = j1;
	js = [j1, j2, j3];
	
	// exit button on the top right corner
	info_exit_button = createButton('X');
	info_exit_button.size(100, 50);
	info_exit_button.position(-1500, 0);
	info_exit_button.mousePressed(close_info_panel);
	
	// logo panel on the top left side, an image will be used as the texture
	panel_logo = createGraphics(200, 80);
	
	// instructions panel, just below the logo
	panel_instructions = new Panel(x=-550, y=29, w=200, h=50, col=color(137, 9, 45), textSize=20, textCol=color(255), textFont=fontQuivira, textLeading=30, textMargin=10, textAlign = CENTER);
	
	// quiz maker panel
	panel_quiz_maker = new Panel(x=-550, y=80, w=200, h=50, col=color(137, 9, 45), textSize=20, textCol=color(255), textFont=fontQuivira, textLeading=30, textMargin=10, textAlign = CENTER);
	
	// settings panel
	settings_x = -550;
	settings_y = 153
	panel_settings_music = new Panel(x=settings_x-50, y=settings_y-24, w=99, h=46, col=color(137, 9, 45), textSize=18, textCol=color(255, 0, 0), textFont=fontQuivira, textLeading=30, textMargin=10, textAlign = CENTER);
	panel_settings_sound = new Panel(x=settings_x+50, y=settings_y-24, w=100, h=46, col=color(137, 9, 45), textSize=18, textCol=color(255, 0, 0), textFont=fontQuivira, textLeading=30, textMargin=10, textAlign = CENTER);
	panel_settings_animation = new Panel(x=settings_x-50, y=settings_y+23, w=99, h=46, col=color(137, 9, 45), textSize=18, textCol=color(255, 0, 0), textFont=fontQuivira, textLeading=30, textMargin=10, textAlign = CENTER);
	panel_settings_orbit = new Panel(x=settings_x+50, y=settings_y+23, w=100, h=46, col=color(137, 9, 45), textSize=18, textCol=color(0, 255, 0), textFont=fontQuivira, textLeading=30, textMargin=10, textAlign = CENTER);
	
	// about panel
	panel_about_button = new Panel(x=-550, y=224, w=200, h=48, col=color(137, 9, 45), textSize=25, textCol=color(255), textFont=fontQuivira, textLeading=30, textMargin=10, textAlign = CENTER);
	// about panel
	panel_about = new Panel(x=0, y=0, w=800, h=500, col=color(255), textSize=25, textCol=color(137, 9, 45), textFont=fontQuivira, textLeading=30, textMargin=10, textAlign = CENTER, interactive=false);
	
	// main panel where questiona and reasoning for each answer appear
	panel_question = new Panel(x=0, y=-150, w=800, h=200, col=color(137, 9, 45), textSize=20, textCol=color(255), textFont=fontQuivira, textLeading=30, textMargin=25, textAlign=LEFT, interactive=false);	
	
	// answer panels, 1,2,3,4, mainly use the default params
	panel_answer1 = new Panel(x=-212.5, y=50);
	panel_answer2 = new Panel(x=212.5, y=50);
	panel_answer3 = new Panel(x=-212.5, y=200);
	panel_answer4 = new Panel(x=212.5, y=200);
	
	// link to main menu
	panel_link_to_menu = new Panel(x=550, y=-271, w=200, h=40, col=color(137, 9, 45), textSize=20, textCol=color(255), textFont=fontQuivira, textLeading=30, textMargin=10, textAlign=CENTER, interactive=true);	

	// right side panels, stats for scenario, question, correct and wrong answers
	side_panel_scenario = new Panel(x=550, y=-225, w=200, h=50, col=color(137, 9, 45), textSize=20, textCol=color(255), textFont=fontQuivira, textLeading=30, textMargin=10, textAlign = LEFT, interactive=false);
	side_panel_question = new Panel(x=550, y=-174, w=200, h=50, col=color(137, 9, 45), textSize=20, textCol=color(255), textFont=fontQuivira, textLeading=30, textMargin=10, textAlign = LEFT, interactive=false);
	side_panel_correct_ans = new Panel(x=550, y=-123, w=200, h=50, col=color(137, 9, 45), textSize=20, textCol=color(255), textFont=fontQuivira, textLeading=30, textMargin=10, textAlign = LEFT, interactive=false);
	side_panel_wrong_ans = new Panel(x=550, y=-72, w=200, h=50, col=color(137, 9, 45), textSize=20, textCol=color(255), textFont=fontQuivira, textLeading=30, textMargin=10, textAlign = LEFT, interactive=false);		
	
	// navigation panels, previous and next buttons
	panel_next_question = new Panel(x=550, y=29, w=200, h=50, col=color(137, 9, 45), textSize=20, textCol=color(255), textFont=fontQuivira, textLeading=30, textMargin=10, textAlign = CENTER);
	panel_previous_question = new Panel(x=550, y=80, w=200, h=50, col=color(137, 9, 45), textSize=20, textCol=color(255), textFont=fontQuivira, textLeading=30, textMargin=10, textAlign = CENTER);
	
	// time panel, starts and stops the timing, also resets the download
	panel_time = new Panel(x=550, y=153, w=200, h=94, col=color(137, 9, 45), textSize=25, textCol=color(255), textFont=fontQuivira, textLeading=30, textMargin=10, textAlign = CENTER);
	
	// download panel, supports json and txt formats independently
	panel_download = new Panel(x=550, y=213, w=200, h=24, col=color(137, 9, 45), textSize=16, textCol=color(255), textFont=fontQuivira, textLeading=20, textMargin=5, textAlign = CENTER, interactive=false);
	
	// format selector panel, created separately to prevent unintentional download when selecting the format, improves the speed
	panel_cb_json = new Panel(x=500, y=238, w=99, h=24, col=color(137, 9, 45), textSize=16, textCol=color(255), textFont=fontQuivira, textLeading=20, textMargin=5, textAlign = CENTER);
	panel_cb_txt = new Panel(x=601, y=238, w=99, h=24, col=color(137, 9, 45), textSize=16, textCol=color(255), textFont=fontQuivira, textLeading=20, textMargin=5, textAlign = CENTER);
	
	// data input panel, called at the end just before the info panel to overwrite other panels
	panel_data_input = new Panel(x=0, y=0, w=width, h=height, col=color(137, 9, 45), textSize=16, textCol=color(255), textFont=fontQuivira, textLeading=20, textMargin=5, textAlign = CENTER);
	

	// gets the scenario number on scenario panel
	scenario_input = createInput();
	scenario_input.position(-400, 0);
	scenario_input.size(20, 20);
	scenario_input.value(1);
	
	
	// assign the initial variables
	
	// right panel stat variables
	num_scenario = Object.keys(data["scenario"])[0];
	num_question = 1;
	num_correct_ans = 0;
	num_wrong_ans = 0;
	
	mouseIsClicked = false;
	timer = 0;
	
	// coords for input panel
	input_x = -850;
	input_y = 0;
	
	// gets the user entries when the answer type is an opinion
	input = createInput();
	input.position(input_x, input_y);
	input.size(800, 200);
	
	// submit button to record the opinion 
	button = createButton('submit');		

	// when there are more than one opinion based answers, keeps everything in memeory
	opinions = [];		
	
	// if the report has been download already, next download will be after the next session
	downloaded_json = false;
	downloaded_txt = false;
	
	// angle to rotate the logo panel
	logo_angle = 0;
	to_right = true;
	to_left = false;
	
	// object angle
	object_angle = 0;
	
	// volume for answer button sounds
	correct_ans_sound.setVolume(1.0);
	wrong_ans_sound.setVolume(1.0);
	opinion_ans_sound.setVolume(1.0);
	
	// toggles the information panel
	toggle_info = false;
	toggle_animation = false;
	toggle_sound = false;
	toggle_music = false;
	toggle_orbit = true;
	toggle_about = false;
	toggle_data_input = false;
	rotate_logo = false;
	
	mosPlayed = false;
	// logo panel rotates on revealing the correct answer
	logo_angle_speed = 1;
	
	// data entry boxes
	qx = -400;
	qy = -400;
	qx = 50;
	qy = 200;
	a1x = 450;
	a1y = 100;
	a2x = 900;
	a2y = 100;
	a3x = 450;
	a3y = 400;
	a4x = 900;
	a4y = 400;
	
	// header for quiz mode 
	header_text = createElement('h1', 'Welcome to the Data Maker platform, here you can create new quiz sets.')
	header_text.position(-1500, 3);
	
	// exit button
	exit_button = createButton('X');
	exit_button.size(100, 50);
	exit_button.position(header_text.x + header_text.width/2 +370, header_text.y + header_text.height - 35);
	exit_button.mousePressed(close_toggle_data_input);
	
	// question box
	quest = createInput();
	quest.size(300, 200);
	quest.position(qx, qy);
	quest_text = createElement('b', 'question is');
	quest_text.position(qx, qy - 20);
	
	// question number, updates automatically
	quest_num = createInput();
	quest_num.size(20, 20);
	quest_num.position(quest.x + 140, quest.y - 60);
	quest_num.value(1);
	quest_num_text = createElement('b', 'question number is')
	quest_num_text.position(quest_num.x - 140, quest_num.y + 4);
	
	// scenario number, user defines
	scenario_num = createInput();
	scenario_num.size(20, 20);
	scenario_num.position(quest_num.x, quest_num.y - 40);
	scenario_num.value(1);
	scenario_num_text = createElement('b', 'scenario number is');
	scenario_num_text.position(scenario_num.x - 140, scenario_num.y + 4);
	
	// answer boxes
	answer1 = new Answer("1", x = a1x, y = a1y, w = 300, h = 100);
	answer2 = new Answer("2", x = a2x, y = a2y, w = 300, h = 100);
	answer3 = new Answer("3", x = a3x, y = a3y, w = 300, h = 100);
	answer4 = new Answer("4", x = a4x, y = a4y, w = 300, h = 100);
	
	// when clicked, pushes the data to the list, keeping the entire data ready for download
	submit_button = createButton('Fill in all the boxes then click to submit');
	submit_button.size(300, 50);
	submit_button.position(quest.x, quest.y + quest.height + 20);
	submit_button.mousePressed(getData);
	
	// file name, can be changed
	file_name = createInput();
	file_name.size(300, 40);
	file_name.position(quest.x, quest.y + 310);
	file_name.value("scenario_" + scenario_num.value());
	
	// when clicked, downloads the data
	download_button = createButton('Rename the file and/or click to download');
	download_button.size(300, 50);
	download_button.position(file_name.x, file_name.y + file_name.height + 20);
	download_button.mousePressed(downloadData);

	// keeps the data, first element is not used, therefore empty
	question = ["empty"];
	
	// rotates the plane where the planets rotate to a nice visible angle
	degree_silk_way = PI*7/9;
	
	// will pause the rotation of the planets
	orbit_pause = 1;
	
	// planets and the meteors
	sun = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.02, distance=0, planet_texture=texture_sun, diameter=10);
	mercury = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.047, distance=15, planet_texture=texture_mercury, diameter=5);
	venus = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.035, distance=30, planet_texture=texture_venus, diameter=8, clockwise = 1);
	earth = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.029, distance=45, planet_texture=texture_earth, diameter=9);
	mars = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.024, distance=60, planet_texture=texture_mars, diameter=4);
	jupiter = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.013, distance=75, planet_texture=texture_jupiter, diameter=7);
	saturn = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.009, distance=90, planet_texture=texture_saturn, diameter=7);
	uranus = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.006, distance=105, planet_texture=texture_uranus, diameter=5, clockwise = 1);
	neptune = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.005, distance=120, planet_texture=texture_neptune, diameter=5);
	pluto = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.04, distance=135, planet_texture=texture_pluto, diameter=2);
	meteor1 = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.01, distance=10, planet_texture=texture_pluto, diameter=0.5);
	meteor2 = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.02, distance=20, planet_texture=texture_pluto, diameter=0.5);
	meteor3 = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.015, distance=30, planet_texture=texture_pluto, diameter=0.5);
	meteor4 = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.019, distance=40, planet_texture=texture_pluto, diameter=0.5);
	meteor5 = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.03, distance=50, planet_texture=texture_pluto, diameter=0.5);
	meteor6 = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.025, distance=60, planet_texture=texture_pluto, diameter=0.5);
	meteor7 = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.014, distance=70, planet_texture=texture_pluto, diameter=0.5);
	meteor8 = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.029, distance=80, planet_texture=texture_pluto, diameter=0.5);
	meteor9 = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.011, distance=90, planet_texture=texture_pluto, diameter=0.5);
	meteor10 = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.031, distance=100, planet_texture=texture_pluto, diameter=0.5);
	meteor11 = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.03, distance=10, planet_texture=texture_pluto, diameter=0.5, clockwise = 1);
	meteor12 = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.06, distance=20, planet_texture=texture_pluto, diameter=0.5, clockwise = 1);
	meteor13 = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.055, distance=30, planet_texture=texture_pluto, diameter=0.5, clockwise = 1);
	meteor14 = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.069, distance=40, planet_texture=texture_pluto, diameter=0.5, clockwise = 1);
	meteor15 = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.07, distance=50, planet_texture=texture_pluto, diameter=0.5, clockwise = 1);
	meteor16 = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.065, distance=60, planet_texture=texture_pluto, diameter=0.5, clockwise = 1);
	meteor17 = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.054, distance=70, planet_texture=texture_pluto, diameter=0.5, clockwise = 1);
	meteor18 = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.059, distance=80, planet_texture=texture_pluto, diameter=0.5, clockwise = 1);
	meteor19 = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.051, distance=90, planet_texture=texture_pluto, diameter=0.5, clockwise = 1);
	meteor20 = new Planet(rotation=degree_silk_way, translationX=-550, translationY=-80, orbit_speed=0.051, distance=100, planet_texture=texture_pluto, diameter=0.5, clockwise = 1);
}

// native JS draw
function draw() {
	// the main background color, set to black to minimize the distraction and keep the focus on the main panels
	background(0);
	// doesn't matter much, since there aren't much animation, it's a good practice to keep it low
	frameRate(10);
	
	cursor(ARROW);
	
	// play background music, repeat once finished
	if (background_music.isPlaying() == false){
		background_music.play();
	}
	if (toggle_music == true){
		panel_settings_music.textCol = color(0, 255, 0);
		background_music.setVolume(1.0);
		// background_music.play();	
	} 
	else if (toggle_music == false){
		background_music.setVolume(0.0);
		panel_settings_music.textCol = color(255, 0, 0);
		// background_music.pause();	
	}
	
	// play/stop galaxy animation
	if (toggle_orbit == true){
		orbit_pause = 1;
	}
	else if (toggle_orbit == false){
		orbit_pause = 0;
	}
	
	// panel where sapienza official logo is displayed
	push();
	translate(-550, -210);
	angleMode(DEGREES);
	
	// animates the Sapienza logo 
	if (!toggle_info && !toggle_data_input && !toggle_about && rotate_logo){
		rotateY(logo_angle);
		logo_angle += logo_angle_speed;
		
		if (logo_angle > radians(359)){
			logo_angle = 0;
			logo_angle_speed = 0;
			rotate_logo = false;
		}
	}	
	texture(sapienza_logo);
	plane(200, 80);
	pop();
	
	// light for a better star visualization
	ambientLight(255);
	
	// runs the galaxy animation
	if (!toggle_info && !toggle_data_input){
		sun.spin();
		mercury.spin();
		venus.spin();
		earth.spin();
		mars.spin();
		jupiter.spin();
		saturn.spin();
		uranus.spin();
		neptune.spin();
		pluto.spin();
		meteor1.spin();
		meteor2.spin();
		meteor3.spin();
		meteor4.spin();
		meteor5.spin();
		meteor6.spin();
		meteor7.spin();
		meteor8.spin();
		meteor9.spin();
		meteor10.spin();
		meteor11.spin();
		meteor12.spin();
		meteor13.spin();
		meteor14.spin();
		meteor15.spin();
		meteor16.spin();
		meteor17.spin();
		meteor18.spin();
		meteor19.spin();
		meteor20.spin();
	}		
	
	// side panels, left and right sides
	panel_instructions.show("Instructions", mode = "instructions");
	panel_quiz_maker.show("Quiz Maker", mode = "quiz");
	panel_settings_music.show("Music", mode = "music");
	panel_settings_sound.show("Sound", mode = "sound");
	panel_settings_animation.show("Animation", mode = "animation");
	panel_settings_orbit.show("Orbit", mode = "orbit");
	panel_about_button.show("About", mode = "about");
	panel_next_question.show("Next Question", mode = "next");
	panel_previous_question.show("Previous Question", mode = "previous");
	side_panel_scenario.show("scenario: " + str(num_scenario));
	side_panel_question.show("question: " + str(num_question));
	side_panel_correct_ans.show("correct: " + str(num_correct_ans));
	side_panel_wrong_ans.show("wrong: " + str(num_wrong_ans));
	panel_time.show("Click to start/end timing", mode = "time");
	panel_download.show("Download the report in");
	panel_cb_json.show(".json", mode = "json");
	panel_cb_txt.show(".txt", mode = "txt");

	// link to main menu
	panel_link_to_menu.show("Go back to menu", mode = "link_to_menu");
	
	// question pael starts with the first question, changed within the class, given here for ease of reading the code
	panel_question.show(data["scenario"][num_scenario]["question"][num_question]["text"]);
	
	// answer panels, can be modified what to show where
	panel_answer1.show(1, mode = "answer");
	panel_answer2.show(2, mode = "answer");
	panel_answer3.show(3, mode = "answer");
	panel_answer4.show(4, mode = "answer");
	
	// starting the input panel and keeping it ready for entry
	input.position(input_x, input_y);
	input.size(800, 200);
	button.position(input.x + input.width - button.width, input.y + input.height - button.height);
	button.mousePressed(getOpinion);
	
	if (toggle_data_input == false && toggle_info == false){
		scenario_input.position(1220, 90);
	}
	else {
		scenario_input.position(-400, 90);
	}
	
	// handles multiple data files on user input
	if (scenario_input.value() == ''){
		// if the scenario number input box is empty, show the first scenario by default
		data = js[0];
	} else {
		// otherwise, if there is a number entered, see if the number that corresponds to the number of json file 
		// exists in the data array
		if (0 < scenario_input.value() && scenario_input.value() < js.length+1){
			data = js[scenario_input.value() - 1];
			// get the new scenario number 
			num_scenario = Object.keys(data["scenario"])[0];
			// if the question number when changing to the new scene exceeds the number of the questions in the new scene
			if (num_question > Object.keys(data["scenario"][num_scenario]["question"]).length - 1){
				// show the first question
				num_question = 1;
			}
			// if there is no number entered after the iteraction (different than the first condition defined above) again, show the first scene
		} 
		else if (scenario_input.value() > js.length){
			data = js[0];
			// get the new scenario number 
			num_scenario = Object.keys(data["scenario"])[0];
			// if the question number when changing to the new scene exceeds the number of the questions in the new scene
			if (num_question > Object.keys(data["scenario"][num_scenario]["question"]).length - 1){
				// show the first question
				num_question = 1;
			}
		}		
	}
	// get the scenario number at the end
	num_scenario = Object.keys(data["scenario"])[0];
	
	// data input panel, allows to create new data
	if (toggle_data_input == true && toggle_info == false){
		toggle_sound = false;
		toggle_about = false;
		toggle_info = false;
		panel_data_input.show();
		qx = 50;
		qy = 200;
		header_text.position(200, 3);
		exit_button.position(header_text.x + header_text.width/2 +370, header_text.y + header_text.height - 35);
		quest.position(qx, qy);
		quest_text.position(qx, qy - 20);
		quest_num.position(quest.x + 140, quest.y - 60);
		quest_num_text.position(quest_num.x - 140, quest_num.y + 4);
		scenario_num.position(quest_num.x, quest_num.y - 40);
		scenario_num_text.position(scenario_num.x - 140, scenario_num.y + 4);	
		submit_button.position(quest.x, quest.y + quest.height + 20);
		// submit_button.mousePressed(getData);
		file_name.position(quest.x, quest.y + 310);
		// file_name.value("scenario_" + scenario_num.value());
		download_button.position(file_name.x, file_name.y + file_name.height + 20);
		// download_button.mousePressed(downloadData);
		answer1.play(show = true);
		answer2.play(show = true);
		answer3.play(show = true);
		answer4.play(show = true);
	}
	else if (toggle_data_input == false){
		qx = -400;
		qy = -400;
		header_text.position(-1500, 3);
		exit_button.position(header_text.x + header_text.width/2 +370, header_text.y + header_text.height - 35);
		quest.position(qx, qy);
		quest_text.position(qx, qy - 20);
		quest_num.position(quest.x + 140, quest.y - 60);
		quest_num_text.position(quest_num.x - 140, quest_num.y + 4);
		scenario_num.position(quest_num.x, quest_num.y - 40);
		scenario_num_text.position(scenario_num.x - 140, scenario_num.y + 4);	
		submit_button.position(quest.x, quest.y + quest.height + 20);
		// submit_button.mousePressed(getData);
		file_name.position(quest.x, quest.y + 310);
		// file_name.value("scenario_" + scenario_num.value());
		download_button.position(file_name.x, file_name.y + file_name.height + 20);
		// download_button.mousePressed(downloadData);
		answer1.play(show = false);
		answer2.play(show = false);
		answer3.play(show = false);
		answer4.play(show = false);
	}

	// information panel, true by default, must be called at the end of draw() to overwrite everything
	if (toggle_info == true){
		toggle_data_input = false;
		toggle_about = false;
		push();
		texture(instructions_texture);
		plane(width, height);
		pop();
		info_exit_button.position(width-info_exit_button.width - 22, 5);
	}	
	else if (toggle_info == false){		
		info_exit_button.position(-1500, 0);
	}
	
	// toggles the about panel, includes general info and credits
	if (toggle_about == true){
		panel_about.show("Sapienza CAS\n\n\nVersion 4.13.2 (Last Stable Build) (Windows Edition)\n\nDWYWWI License 2019\n\nThis application is made possible by the P5JS open source project\n\nAll the assets used in the application are loyalty free\n\nMusic: Yiruma - Kiss the Rain\n\n\n Kanan Rahimli\nemail: kenanhusayn@gmail.com");
	}
}

// default functions to catch mouse clicks for effective interaction 
function mousePressed(){
	mouseIsClicked = true;
}
function mouseReleased(){
	mouseIsClicked = false;
}

// calls back when the submit button is clicked, brings up the entry panel
function getOpinion() {
	user_opinion = input.value();
	opinions.push("opinion on scenario " + num_scenario + " question " + num_question + " is: \r\n" + user_opinion + "\r\n");
	input.value('');
	input_x = -850;
	input_y = 0;
}


// keyboard interactions, can be added if needed, removed mainly because the current control method offer a better interaction
// function keyPressed() {
  // if (key == 'i' || key == 'I') {
	  // toggle_info  = !toggle_info;
  // } 
  // else if (key == 'a' || key == 'A') {
	  // toggle_animation = !toggle_animation;
  // }
  // else if (key == 's' || key == 'S') {
	  // toggle_sound = !toggle_sound;
  // }
  // else if (key == 'm' || key == 'M') {
	  // toggle_music = !toggle_music;
  // }
  // else if (key == 'e' || key == 'E') {
	  // toggle_data_input = !toggle_data_input;
  // }
// }

// gets the data entered in the entry boxes
function getData() {
	question.push({
					"text": quest.value(),
					"answer": {
						"1": {
							"text": answer1.answer.value(),
							"result": answer1.result,
							"reason": answer1.reason.value(),
							"next": answer1.next.value()
						},
						"2": {
							"text": answer2.answer.value(),
							"result": answer2.result,
							"reason": answer2.reason.value(),
							"next": answer2.next.value()
						},
						"3": {
							"text": answer3.answer.value(),
							"result": answer3.result,
							"reason": answer3.reason.value(),
							"next": answer3.next.value()
						},
						"4": {
							"text": answer4.answer.value(),
							"result": answer4.result,
							"reason": answer4.reason.value(),
							"next": answer4.next.value()
						}
					}
				});
	
		quest.value('');
		answer1.erase();
		answer1.next.value(question.length);
		answer2.erase();
		answer2.next.value(question.length);
		answer3.erase();
		answer3.next.value(question.length);
		answer4.erase();
		answer4.next.value(question.length);
		
		quest_num.value(question.length);	
}

// downloads the data collected from entry panel
function downloadData(){
	const snv = scenario_num.value();
	createStringDict(
	{
		"scenario": {
			[snv]: {
				question
			}
		}
	}).saveJSON(file_name.value());
}

// closes quiz maker windows
function close_toggle_data_input(){
	toggle_data_input = false;
}

// closes information windows
function close_info_panel(){
	toggle_info = false;
}

// Panel class, keeps the main frame for all the different panels, functional differences are handles in the show() method for each panel mode, passed in the draw()
class Panel {
	// cons. with default parameters
	constructor(x=0, y=0, w=375, h=100, col=color(137, 9, 45), textSize=20, textCol=color(255), textFont=fontQuivira, textLeading=30, textMargin=25, textAlign=LEFT, interactive=true) {
		this.x = x;
		this.y = y;	
		this.w = w;
		this.h = h;
		this.col = col;
		this.textSize = textSize;
		this.textAlign = textAlign;
		this.textCol = textCol;
		this.textFont = textFont;
		this.textLeading = textLeading; // Set leading to 10
		this.textMargin = textMargin;
		this.interactive = interactive;
		this.enlarge = 0;
		
		// panel object is used to keep all the cosmetic changes as well as the text to be displayed inside and passed as a texture, allows a smoother user experience
		this.panel = createGraphics(this.w, this.h);	
		this.answerCounted = false;
		this.clickCount = 0;	
		this.textToDisplay = "enter text in draw()";
		this.previous = 1;
		this.angle = 0;
		this.to_left = true;
		this.to_right = false;
		this.rot_speed = 0.1;
  }
	
	// main display method, handles all the actions separately for each panel mode inside simple if - else condtional statements
	show(a, mode) {
		// the whole unit is inside a push() and pop() set keep the translations and future matrix impllementations independent from each others
		push(); 
		
		// panel parameters
		this.panel.background(this.col);
		this.panel.textSize(this.textSize);
		this.panel.textStyle(NORMAL);
		this.panel.textAlign(this.textAlign);
		this.panel.textFont(this.textFont);	
		this.panel.fill(this.textCol);
		this.panel.textLeading(this.textLeading);
		
		// handles mouse click actions on objects, single and multiple clicks are supported, end conditions are defined for every mode separately
		if (abs(innerWidth/2+this.x-mouseX) < this.w/2 && abs(innerHeight/2+this.y-mouseY) < this.h/2){
			if (mouseIsClicked == true){
				this.clickCount += 1;
			}
			
			if (this.interactive == true){
				if (toggle_animation == true){
					this.enlarge = 10;
				}
				cursor(HAND);
			}
			else if (this.interactive == false){
				cursor(ARROW);
			}
		}
		
		// clicking outside the focused object
		else if (!(abs(innerWidth/2+this.x-mouseX) < this.w/2 && abs(innerHeight/2+this.y-mouseY) < this.h/2)){
			if (mouseIsClicked == true){
				if (mode != "time"){
					this.clickCount = 0;
				}
			}
			
			if (this.interactive == true){
				if (toggle_animation == true){
					this.enlarge = 0;
				}
			}
			
			if (toggle_animation == false){
				this.enlarge = 0;
			}
		}
		
		
		// answer mode, when the panel is of answer type
		if (mode == "answer"){
			// initially shows the answer text that is taken from json file in the /database
			if (this.clickCount == 0){
				this.textToDisplay = data["scenario"][num_scenario]["question"][num_question]["answer"][a]["text"];
			}
			// when clicked once, shows if the answer is CORRECT, WRONG or OPINION type
			else if (this.clickCount == 1){
				// animate the object, the panel will slowly rotate while showing the result, clicking again sets the rotation off
				this.animate();
				
				// taken from the json file. file format must not be changed unless the proper modification is done in the code as well
				this.textToDisplay = data["scenario"][num_scenario]["question"][num_question]["answer"][a]["result"];
				
				// the reason for the answer is displayed on the question panel
				panel_question.show(data["scenario"][num_scenario]["question"][num_question]["answer"][a]["reason"]);

					// if the answer wasn't selected before
					if (this.answerCounted == false){
						// counts the answer only once
						this.answerCounted = true;
						
						// handles the counting for the stats
						if (data["scenario"][num_scenario]["question"][num_question]["answer"][a]["result"] == "CORRECT"){
							// play the sound
							if (toggle_sound == true) {
								correct_ans_sound.play();
							}
							// animate the logo
							rotate_logo = true;
							// adds to the correct answers
							num_correct_ans += 1;
						}		
						else if (data["scenario"][num_scenario]["question"][num_question]["answer"][a]["result"] == "WRONG"){
							// play the sound
							if (toggle_sound == true) {
								wrong_ans_sound.play();
							}
							// adds to the wrong answers
							num_wrong_ans += 1;
						}	
						else if (data["scenario"][num_scenario]["question"][num_question]["answer"][a]["result"] == "OPINION"){
							// play the sound
							if (toggle_sound == true) {
								opinion_ans_sound.play();
							}
						}
					}
			}
			
			// when clicked twice, shows if the answer was CORRECT, WRONG or OPINION type
			else if (this.clickCount == 2){
				// resets the click count, in case the user is just surfing, not really taking a test, allows the useer to check all the other answers
				this.clickCount = 0;

				// set the rotation degree back to 0, so the answer is readable
				this.degree = 0;
				
				// if the answer was correct
				if (data["scenario"][num_scenario]["question"][num_question]["answer"][a]["result"] == "CORRECT"){
					// shows the next question, next here is defined in the json file as the given question could continue in a non-linear fashion
					num_question = data["scenario"][num_scenario]["question"][num_question]["answer"][a]["next"];
					this.answerCounted = false;
				}
				// if the answer was wrong, resets it, s the user can choose another answer 
				if (data["scenario"][num_scenario]["question"][num_question]["answer"][a]["result"] == "WRONG"){
					// animate the object on second click for wrong answers
					this.animate();
					// set the speed back to def
					this.rot_speed = 0.1;
					this.answerCounted = false;
				}
				// if the answer if of the opinion type, brings up the entry mode that allows the user to type in their opinion
				if (data["scenario"][num_scenario]["question"][num_question]["answer"][a]["result"] == "OPINION"){
					input_x = innerWidth/2-400;
					input_y = innerHeight/2-250;
					this.answerCounted = false;
				}
			}
		}		
		// previous mode, when the panel is of previous type, independently from whatever the answer might be, shows the previous question until the last question in the scenario
		else if (mode == "previous"){
			this.textToDisplay = a;
			// works with single click
			if (this.clickCount == 1){
				// reset the mouse click
				this.clickCount = 0;
				// since the first questions is numbered one, don't go below 1
				if (num_question > 1){
					num_question -= 1;
				}
			}			
		}
		// identical functions for the mode next
		else if (mode == "next"){
			this.textToDisplay = a;
			if (this.clickCount == 1){
				this.clickCount = 0;
				// goes up to last questions, determined by list length, native
				if (num_question < Object.keys(data["scenario"][num_scenario]["question"]).length - 1){
					num_question += 1;
				}
			}						
		}
		// time mode, when the panel is of time type, click to start the timing, click to stop and next click to reset the timer, resets the session and downloads too
		else if (mode == "time"){
			if (this.clickCount == 0){
				// initailly displays 0:0:0, modify here
				this.textToDisplay = "0 : 0 : 0 \n\nClick to start";	
			}
			// start the timer
			else if (this.clickCount == 1){
				// resets the dowload status for json and txt in the new session
				downloaded_json = false;
				downloaded_txt = false;
				if (frameCount % 10 == 1){
					// counts the time
					timer += 1;
				}
				// time is approximate value of frame rate being compared to frame count, rounds it down to get an accurate value
				this.textToDisplay = floor(timer/3600) + ":" + floor((timer-floor(timer/3600)*3600)/60) + ":" + timer % 60 + "\n\nClick to end";
			}
			// ends the timing
			else if (this.clickCount == 2){
				// shows what was the last time value that later will be passed to report as well
				this.textToDisplay = floor(timer/3600) + ":" + floor((timer-floor(timer/3600)*3600)/60) + ":" + timer % 60 + "\n\nFinished!";
			}
			else if (this.clickCount == 3){
				// reset the counter
				this.clickCount = 0;
				timer = 0;
			}
		}
		// download mode, when the panel is of json type, clicking on the panel downloads the report in json format
		else if (mode == "json"){
			this.textToDisplay = a;
			if (this.clickCount == 1 && downloaded_json == false){	
				// resets the counter for downloads
				this.clickCount = 0;
				// restricts multiple downloads of the same report file, for security and performace purposes
				downloaded_json = true;
				
				// saves the report as .json for further analysis and illustration
				createStringDict({
					"number of correct answers": num_correct_ans,
					"number of wrong answers": num_wrong_ans,
					"time spent for the test": floor(timer/3600) + ":" + floor((timer-floor(timer/3600)*3600)/60) + ":" + timer % 60,
					"total score": num_correct_ans - num_wrong_ans
				}).saveJSON('report');	
			}
		}
		
		// same for txt format
		else if (mode == "txt"){
			this.textToDisplay = a;
			if (this.clickCount == 1 && downloaded_txt == false){	
				// resets the counter for downloads
				this.clickCount = 0;
				// restricts multiple downloads of the same report file, for security and performace purposes
				downloaded_txt = true;
				
				// saves the report as .txt
				saveStrings(["number of correct answers:" + num_correct_ans, "\r\nnumber of wrong answers:" + num_wrong_ans, "\r\ntime spent for the test:" + floor(timer/3600) + ":" + floor((timer-floor(timer/3600)*3600)/60) + ":" + timer % 60, "\r\ntotal score:" + (num_correct_ans - num_wrong_ans), "\r\n" + opinions.toString().replace(",","")], 'report.txt');
			}
		}
		
		// instructions mode
		else if (mode == "instructions"){
			this.textToDisplay = a;
			if (this.clickCount == 1 && toggle_data_input == false){				
				toggle_info = true;
			}
			else if (this.clickCount == 2){	
				toggle_info = false;
				this.clickCount = 0;
			}
		}

		// quiz maker mode
		else if (mode == "quiz"){
			this.textToDisplay = a;
			if (this.clickCount == 1){	
				toggle_data_input = true;
			}
			else if (this.clickCount == 2){	
				toggle_data_input = false;
				this.clickCount = 0;
			}
		}

		// settings mode, various types
		else if (mode == "music"){
			this.textToDisplay = a;
			if (this.clickCount == 1 && !toggle_info && !toggle_data_input){
				this.textCol = color(0, 255, 0);
				toggle_music = true;
			}
			else if (this.clickCount == 2){	
				this.textCol = color(255, 0, 0);
				toggle_music = false;
				this.clickCount = 0;
			}
		}
		
		// sound mode, for button sounds
		else if (mode == "sound"){
			this.textToDisplay = a;
			if (this.clickCount == 1){
				this.textCol = color(0, 255, 0);
				toggle_sound = true;	
			}
			else if (this.clickCount == 2){	
				this.textCol = color(255, 0, 0);
				toggle_sound = false;
				this.clickCount = 0;
			}
		}
		
		// animation mode, for buttons
		else if (mode == "animation"){
			this.textToDisplay = a;
			if (this.clickCount == 1){	
				this.textCol = color(0, 255, 0);
				toggle_animation = true;
			}
			else if (this.clickCount == 2){	
				this.textCol = color(255, 0, 0);
				toggle_animation = false;
				this.clickCount = 0;
			}
		}
		
		// orbit mode, for orbit button
		else if (mode == "orbit"){
			this.textToDisplay = a;
			if (this.clickCount == 1){
				this.textCol = color(0, 255, 0);
				toggle_orbit = true;
			}
			else if (this.clickCount == 2){
				this.textCol = color(255, 0, 0);
				toggle_orbit = false;
				this.clickCount = 0;
			}
		}
		
		// about mode
		else if (mode == "about"){
			this.textToDisplay = a;
			if (this.clickCount == 1){
				toggle_about = true;
			}
			else if (this.clickCount == 2){	
				toggle_about = false;
				this.clickCount = 0;
			}
		}
		
		// link_to_menu mode
		else if (mode == "link_to_menu"){
			this.textToDisplay = a;
			if (this.clickCount == 1){
				this.clickCount = 0;
				open("https://knnrhml.github.io/cas-menu/", "_self");
			}
		}		
		
		// otherwise if the panel has no interactions, just display whatever that was passed in
		else{
			// inactive panel, display whatever that is passed
			this.textToDisplay = a;
		}
		
		// converts the results of previous operations into texture and wraps around the panel
		// margin for the text is handled automatically given the spaces are the same from each 4 sides
		this.panel.text(this.textToDisplay, this.textMargin, this.textMargin, this.w-this.textMargin*2, this.h-this.textMargin*2);
		// wraps the texture
		texture(this.panel);
		// move the panel to specified position
		translate(this.x, this.y);
		// rotate the plane around its Z axis, the nagle is being updated in the animate() method
		rotateZ(this.angle);
		// create the plane object
		plane(this.w + this.enlarge, this.h + this.enlarge); 
		// reset all the configurations to default
		pop();
  }
  
  // animates the planes, swing animation, rotates the plane left to right and vv with decreasing speed
	animate(){
		if (toggle_animation == true){
			if (this.to_left == true){
				this.angle += this.rot_speed;
			}
			else if (this.to_right == true){
				this.angle -= this.rot_speed;
			}
			if (this.angle > PI/60){
				this.to_left = false;
				this.to_right = true;
			} 
			else if (this.angle < -PI/60) {
				this.to_left = true;
				this.to_right = false;
			}
			this.rot_speed -= 0.005;
			if (this.rot_speed < 0){
				this.rot_speed = 0;
				this.angle = 0;
				this.to_left = true;
				this.to_right = false;
			}
		}
	}
}

// class for data entry panels, created separately to control rather complicated objects 
class Answer{
	constructor(name = "test", x = 100, y = 100, w = 200, h = 100, w1 = 20, h1 = 20){
		this.x_ = x;
		this.y_ = y;
		this.w = w;
		this.h = h;
		this.w1 = w1;
		this.h1 = h1;
		
		// every box has an answer section
		this.answer = createInput();
		this.answer.size(this.w, this.h);
		this.answer.position(this.x, this.y);
		this.answer_text = createElement('b', name + ' - answer is')
		this.answer_text.position(this.answer.x, this.answer.y - 20);
		
		// every box has a reason section
		this.reason = createInput();
		this.reason.size(this.w, this.h);
		this.reason.position(this.answer.x, this.answer.y + this.answer.height + 20);
		this.reason_text = createElement('b', 'reason is')
		this.reason_text.position(this.reason.x, this.reason.y - 20);
		
		// every box has a next section
		this.next = createInput();
		this.next.size(this.w1, this.h1);
		this.next.position(this.answer.x + this.answer.width + 60, this.answer.y + this.answer.height - 40);
		this.next_text = createElement('b', 'next is')
		this.next_text.position(this.next.x - 50, this.next.y + 4);	
		this.next.value(1);	
		
		// every box has three checkbox sections where the user can define if the answer is either CORRECT, WRONG or OPINION
		this.correct = createCheckbox('CORRECT', false);
		this.correct.position(this.answer.x + this.answer.width + 2, this.answer.y);
		this.wrong = createCheckbox('WRONG', false);
		this.wrong.position(this.answer.x + this.answer.width + 2, this.answer.y + 20);
		this.opinion = createCheckbox('OPINION', false);
		this.opinion.position(this.answer.x + this.answer.width + 2, this.answer.y + 40);	
	}
	
	// runs the boxes, used to activate/deactivate the boxes
	play(show){
		if (this.wrong.checked() == true){
			this.result = "WRONG";
		}
		else if (this.opinion.checked() == true){
			this.result = "OPINION";
		} else {
			this.result = "CORRECT";
		}
		
		// show mode, to display the boxes 
		if (show == true){
			this.x = this.x_;
			this.y = this.y_;
			this.answer.position(this.x, this.y);
			this.answer_text.position(this.answer.x, this.answer.y - 20);
			this.reason.position(this.answer.x, this.answer.y + this.answer.height + 20);
			this.reason_text.position(this.reason.x, this.reason.y - 20);
			this.next.position(this.answer.x + this.answer.width + 60, this.answer.y + this.answer.height - 40);
			this.next_text.position(this.next.x - 50, this.next.y + 4);	
			this.correct.position(this.answer.x + this.answer.width + 2, this.answer.y);
			this.wrong.position(this.answer.x + this.answer.width + 2, this.answer.y + 20);
			this.opinion.position(this.answer.x + this.answer.width + 2, this.answer.y + 40)			
		}
		else if (show == false){
			this.x = -400;
			this.y = -400;
			this.answer.position(this.x, this.y);
			this.answer_text.position(this.answer.x, this.answer.y - 20);
			this.reason.position(this.answer.x, this.answer.y + this.answer.height + 20);
			this.reason_text.position(this.reason.x, this.reason.y - 20);
			this.next.position(this.answer.x + this.answer.width + 60, this.answer.y + this.answer.height - 40);
			this.next_text.position(this.next.x - 50, this.next.y + 4);	
			this.correct.position(this.answer.x + this.answer.width + 2, this.answer.y);
			this.wrong.position(this.answer.x + this.answer.width + 2, this.answer.y + 20);
			this.opinion.position(this.answer.x + this.answer.width + 2, this.answer.y + 40)			
		}
	}	
	
	// erases the data entered when submit button is pressed for the next data entry
	erase(){
		this.answer.value('');
		this.reason.value('');
		this.next.value('');
	}
}

// class for planets and meteors
class Planet{
	constructor(rotation=0, translationX=-550, translationY=-480, orbit_speed=1, distance=0, planet_texture=texture_sun, diameter=10, clockwise = -1){
		this.rotation = rotation;
		this.translationX = translationX;
		this.translationY = translationY;
		this.orbit_speed = orbit_speed;
		this.distance = distance;
		this.planet_texture = planet_texture;
		this.diameter = diameter;
		this.clockwise = clockwise;
		this.speed = 0;
	}
	
	// animates the spheres
	spin(){	
		// sets in the place and orientation
		push();
		translate(this.translationX, this.translationY);
		rotateX(this.rotation);
		
		// rotates around the axis normal to galaxy plane
		rotateY(this.speed * this.clockwise);
		translate(this.distance, 0);		
		this.speed += this.orbit_speed * orbit_pause;
		
		// wraps around the sphere the textue taken from preload
		texture(this.planet_texture);
		sphere(this.diameter);	
		pop();
	}
}
