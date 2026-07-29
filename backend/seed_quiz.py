from app import create_app, db
from app.models.quiz import QuizCategory, QuizQuestion

app = create_app()

CATEGORIES = [
    {'code': 'GI', 'name': 'General ICT', 'icon': '💻', 'description': 'Basic IT knowledge, computer fundamentals, internet concepts'},
    {'code': 'PL', 'name': 'Programming Languages', 'icon': '🐍', 'description': 'Python, Java, JavaScript, C++ and other programming concepts'},
    {'code': 'WD', 'name': 'Web Development', 'icon': '🌐', 'description': 'HTML, CSS, JavaScript, React, backend frameworks'},
    {'code': 'MD', 'name': 'Mobile Development', 'icon': '📱', 'description': 'Android, iOS, Flutter, React Native development'},
    {'code': 'DB', 'name': 'Database', 'icon': '🗄️', 'description': 'SQL, NoSQL, database design, queries'},
    {'code': 'DS', 'name': 'Data Science & AI', 'icon': '🤖', 'description': 'Machine learning, AI, data analysis, Python for data science'},
    {'code': 'CC', 'name': 'Cloud Computing', 'icon': '☁️', 'description': 'AWS, Azure, GCP, cloud services and deployment'},
    {'code': 'SRE', 'name': 'DevOps & SRE', 'icon': '⚙️', 'description': 'CI/CD, Docker, Kubernetes, DevOps practices'},
    {'code': 'C', 'name': 'Cybersecurity', 'icon': '🔒', 'description': 'Network security, ethical hacking, cryptography'},
    {'code': 'SA', 'name': 'Networking & System Admin', 'icon': '🌐', 'description': 'TCP/IP, network protocols, system administration'},
    {'code': 'QA', 'name': 'Testing & QA', 'icon': '🧪', 'description': 'Software testing, QA methodologies, automation testing'},
    {'code': 'UI', 'name': 'UI/UX Design', 'icon': '🎨', 'description': 'User interface design, UX research, Figma, prototyping'},
    {'code': 'DA', 'name': 'Data Analytics & BI', 'icon': '📊', 'description': 'Power BI, Tableau, data visualization, business intelligence'},
    {'code': 'ES', 'name': 'Embedded Systems & IoT', 'icon': '🔧', 'description': 'Arduino, Raspberry Pi, IoT protocols, embedded programming'},
]

QUESTIONS = {
    'GI': [
        ('GI1', 'What does CPU stand for?', 'Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Core Processing Unit', 0),
        ('GI2', 'Which of the following is an operating system?', 'Python', 'Ubuntu', 'MySQL', 'React', 1),
        ('GI3', 'What is RAM used for?', 'Permanent storage', 'Temporary data storage', 'Processing graphics', 'Network communication', 1),
        ('GI4', 'What does HTTP stand for?', 'HyperText Transfer Protocol', 'High Transfer Text Protocol', 'HyperText Type Protocol', 'Host Transfer Text Protocol', 0),
        ('GI5', 'Which device connects computers in a network?', 'Monitor', 'Router', 'Scanner', 'Printer', 1),
        ('GI6', 'What is the binary representation of decimal 5?', '101', '110', '011', '100', 0),
        ('GI7', 'What does SSD stand for?', 'Super Speed Drive', 'Solid State Drive', 'System Storage Disk', 'Solid System Disk', 1),
        ('GI8', 'Which protocol is used for email sending?', 'FTP', 'HTTP', 'SMTP', 'SSH', 2),
        ('GI9', 'What is the function of an IP address?', 'Store files', 'Identify devices on a network', 'Speed up processor', 'Display graphics', 1),
        ('GI10', 'What does GUI stand for?', 'General User Interface', 'Graphical User Interface', 'Global Utility Interface', 'Graphical Unix Interface', 1),
    ],
    'PL': [
        ('PL1', 'Which language is known as the mother of all languages?', 'Python', 'Java', 'C', 'COBOL', 2),
        ('PL2', 'What is the output of: print(2 ** 3) in Python?', '6', '8', '9', '5', 1),
        ('PL3', 'Which of these is a compiled language?', 'Python', 'JavaScript', 'Java', 'Ruby', 2),
        ('PL4', 'What is a variable in programming?', 'A fixed value', 'A named storage location', 'A function name', 'A loop structure', 1),
        ('PL5', 'Which symbol is used for comments in Python?', '//', '/*', '#', '--', 2),
        ('PL6', 'What does OOP stand for?', 'Object Oriented Programming', 'Open Object Protocol', 'Output Oriented Process', 'Object Operation Program', 0),
        ('PL7', 'What is recursion in programming?', 'A loop structure', 'A function calling itself', 'A type of variable', 'A sorting algorithm', 1),
        ('PL8', 'Which data type stores True or False?', 'Integer', 'String', 'Float', 'Boolean', 3),
        ('PL9', 'What is an array?', 'A single value', 'A collection of elements', 'A function', 'A class', 1),
        ('PL10', 'Which keyword defines a function in Python?', 'function', 'def', 'func', 'define', 1),
    ],
    'WD': [
        ('WD1', 'What does HTML stand for?', 'HyperText Markup Language', 'High Text Making Language', 'HyperText Making Links', 'Hyper Transfer Markup Language', 0),
        ('WD2', 'Which CSS property changes text color?', 'font-color', 'text-color', 'color', 'foreground', 2),
        ('WD3', 'What is React?', 'A database', 'A JavaScript framework/library', 'A CSS framework', 'A server language', 1),
        ('WD4', 'What does REST API stand for?', 'Remote External State Transfer', 'Representational State Transfer', 'Resource Exchange State Transfer', 'Remote System Transfer', 1),
        ('WD5', 'Which tag is used for hyperlinks in HTML?', '<link>', '<href>', '<a>', '<url>', 2),
        ('WD6', 'What is the purpose of CSS?', 'Add functionality', 'Style web pages', 'Store data', 'Handle requests', 1),
        ('WD7', 'What is a cookie in web development?', 'A type of database', 'Small data stored in browser', 'A JavaScript function', 'A CSS selector', 1),
        ('WD8', 'Which HTTP method retrieves data?', 'POST', 'PUT', 'GET', 'DELETE', 2),
        ('WD9', 'What is JSON?', 'Java Standard Object Notation', 'JavaScript Object Notation', 'Java Server Object Network', 'JavaScript Order Notation', 1),
        ('WD10', 'What does DOM stand for?', 'Document Object Model', 'Data Object Management', 'Document Order Map', 'Dynamic Object Model', 0),
    ],
    'MD': [
        ('MD1', 'Which language is primarily used for Android?', 'Swift', 'Kotlin/Java', 'Dart', 'C#', 1),
        ('MD2', 'Which language is used for iOS development?', 'Kotlin', 'Java', 'Swift', 'Python', 2),
        ('MD3', 'What is Flutter?', 'An Android-only framework', 'A cross-platform UI framework by Google', 'An iOS framework', 'A database system', 1),
        ('MD4', 'What is React Native used for?', 'Web development only', 'Cross-platform mobile apps', 'iOS apps only', 'Desktop apps', 1),
        ('MD5', 'What is APK in Android?', 'Application Package Kit', 'Android Package Kit', 'App Program Kit', 'Android Program Key', 1),
        ('MD6', 'What language is used in Flutter?', 'Java', 'Swift', 'Dart', 'Kotlin', 2),
        ('MD7', 'What does SDK stand for?', 'Software Development Kit', 'System Data Key', 'Software Distribution Kit', 'System Development Key', 0),
        ('MD8', 'Which store distributes Android apps?', 'App Store', 'Google Play Store', 'Microsoft Store', 'Amazon Store', 1),
        ('MD9', 'What is an emulator in mobile development?', 'A real device', 'A simulated device for testing', 'A build tool', 'A design tool', 1),
        ('MD10', 'What is a widget in Flutter?', 'A database table', 'A UI building block', 'A network request', 'A file format', 1),
    ],
    'DB': [
        ('DB1', 'What does SQL stand for?', 'Structured Query Language', 'Simple Query Language', 'System Query Logic', 'Structured Question Language', 0),
        ('DB2', 'Which command retrieves data in SQL?', 'INSERT', 'SELECT', 'UPDATE', 'DELETE', 1),
        ('DB3', 'What is a primary key?', 'A password for database', 'A unique identifier for each record', 'The first column', 'A foreign reference', 1),
        ('DB4', 'What is a foreign key?', 'A key from another country', 'A key that references another table', 'A duplicate key', 'A secondary password', 1),
        ('DB5', 'Which is a NoSQL database?', 'MySQL', 'PostgreSQL', 'MongoDB', 'Oracle', 2),
        ('DB6', 'What does DBMS stand for?', 'Database Management System', 'Data Backup Management System', 'Database Multiple System', 'Data Building Management Software', 0),
        ('DB7', 'What is normalization in databases?', 'Making data larger', 'Organizing data to reduce redundancy', 'Deleting old data', 'Encrypting data', 1),
        ('DB8', 'Which SQL clause filters results?', 'ORDER BY', 'GROUP BY', 'WHERE', 'HAVING', 2),
        ('DB9', 'What is a JOIN in SQL?', 'Delete operation', 'Combines rows from two or more tables', 'Creates a new table', 'Updates records', 1),
        ('DB10', 'What is an index in a database?', 'A list of databases', 'A structure to speed up queries', 'A backup copy', 'A foreign key', 1),
    ],
    'DS': [
        ('DS1', 'What is machine learning?', 'Teaching machines to walk', 'Systems that learn from data', 'Programming robots', 'Hardware configuration', 1),
        ('DS2', 'Which library is used for data manipulation in Python?', 'NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn', 1),
        ('DS3', 'What is supervised learning?', 'Learning with labeled data', 'Learning without data', 'Learning with unlabeled data', 'Reinforcement learning', 0),
        ('DS4', 'What is a neural network?', 'A computer network', 'A model inspired by the human brain', 'A type of database', 'A programming language', 1),
        ('DS5', 'What does AI stand for?', 'Automated Interface', 'Artificial Intelligence', 'Automated Integration', 'Advanced Interface', 1),
        ('DS6', 'What is overfitting in ML?', 'Model performs well on all data', 'Model performs well on training but poorly on new data', 'Model is too simple', 'Model has no errors', 1),
        ('DS7', 'Which algorithm is used for classification?', 'Linear Regression', 'K-Means', 'Random Forest', 'PCA', 2),
        ('DS8', 'What is a training dataset?', 'Data used to test the model', 'Data used to train the model', 'Raw uncleaned data', 'Visualization data', 1),
        ('DS9', 'What is TF-IDF used for?', 'Image recognition', 'Text feature extraction', 'Database queries', 'Network security', 1),
        ('DS10', 'What is Pandas used for in Python?', 'Web development', 'Data manipulation and analysis', 'Mobile development', 'Game development', 1),
    ],
    'CC': [
        ('CC1', 'What is cloud computing?', 'Computing using weather data', 'Delivering services over the internet', 'A type of hardware', 'Local server management', 1),
        ('CC2', 'What does AWS stand for?', 'Advanced Web Services', 'Amazon Web Services', 'Automated Web System', 'Amazon Wireless Services', 1),
        ('CC3', 'What is IaaS?', 'Internet as a Service', 'Infrastructure as a Service', 'Integration as a Service', 'Interface as a Service', 1),
        ('CC4', 'What is SaaS?', 'System as a Service', 'Software as a Service', 'Storage as a Service', 'Security as a Service', 1),
        ('CC5', 'Which company provides Azure cloud?', 'Google', 'Amazon', 'Microsoft', 'IBM', 2),
        ('CC6', 'What is a virtual machine in cloud?', 'A physical server', 'An emulated computer system', 'A network device', 'A storage unit', 1),
        ('CC7', 'What is auto-scaling in cloud?', 'Manual server management', 'Automatic adjustment of resources', 'Data backup process', 'Network configuration', 1),
        ('CC8', 'What does GCP stand for?', 'Global Computing Platform', 'Google Cloud Platform', 'General Cloud Provider', 'Google Computing Protocol', 1),
        ('CC9', 'What is serverless computing?', 'Computing without electricity', 'Running code without managing servers', 'Offline computing', 'Local computing', 1),
        ('CC10', 'What is a CDN?', 'Central Data Network', 'Content Delivery Network', 'Cloud Data Node', 'Central Deployment Network', 1),
    ],
    'SRE': [
        ('SRE1', 'What does CI/CD stand for?', 'Continuous Integration/Continuous Deployment', 'Code Integration/Code Deployment', 'Continuous Interface/Code Design', 'Computer Integration/Computer Design', 0),
        ('SRE2', 'What is Docker used for?', 'Database management', 'Containerization of applications', 'Web design', 'Network security', 1),
        ('SRE3', 'What is Kubernetes?', 'A programming language', 'Container orchestration system', 'A database', 'A web framework', 1),
        ('SRE4', 'What is Git used for?', 'Database management', 'Version control', 'Web hosting', 'Testing', 1),
        ('SRE5', 'What is Infrastructure as Code?', 'Writing code on paper', 'Managing infrastructure through code', 'Hardware programming', 'Network coding', 1),
        ('SRE6', 'What is Jenkins?', 'A database tool', 'A CI/CD automation server', 'A web framework', 'A cloud provider', 1),
        ('SRE7', 'What is a microservice?', 'A small computer', 'Small independent deployable service', 'A mini database', 'A lightweight OS', 1),
        ('SRE8', 'What is monitoring in DevOps?', 'Watching employees', 'Tracking system performance and health', 'Code review process', 'Testing process', 1),
        ('SRE9', 'What does SRE stand for?', 'Software Reliability Engineering', 'Site Reliability Engineering', 'System Resource Engineering', 'Service Reliability Engineering', 1),
        ('SRE10', 'What is Terraform used for?', 'Web development', 'Infrastructure provisioning', 'Database management', 'Mobile development', 1),
    ],
    'C': [
        ('C1', 'What is a firewall?', 'A physical wall in data centers', 'A network security system', 'A type of virus', 'A database backup', 1),
        ('C2', 'What is phishing?', 'A network protocol', 'A cyberattack using deceptive emails', 'A type of firewall', 'A programming concept', 1),
        ('C3', 'What does encryption do?', 'Deletes data', 'Converts data to unreadable format', 'Speeds up network', 'Compresses files', 1),
        ('C4', 'What is a VPN?', 'Very Private Network', 'Virtual Private Network', 'Verified Protocol Network', 'Virtual Protocol Node', 1),
        ('C5', 'What is malware?', 'Useful software', 'Malicious software', 'Mail software', 'Management software', 1),
        ('C6', 'What is two-factor authentication?', 'Two passwords', 'Two-step verification using two methods', 'Double encryption', 'Two firewalls', 1),
        ('C7', 'What is a DDoS attack?', 'Data Download over Servers', 'Distributed Denial of Service', 'Dynamic Data over Systems', 'Direct Denial of Service', 1),
        ('C8', 'What is penetration testing?', 'Testing database connections', 'Authorized simulated cyberattack', 'Network speed testing', 'Software performance testing', 1),
        ('C9', 'What does SSL stand for?', 'Secure Server Language', 'Secure Sockets Layer', 'System Security Layer', 'Secure Storage Link', 1),
        ('C10', 'What is a zero-day vulnerability?', 'A vulnerability with no impact', 'Unknown vulnerability exploited before patch', 'A 24-hour bug', 'A beginner-level bug', 1),
    ],
    'SA': [
        ('SA1', 'What does TCP/IP stand for?', 'Transfer Control Protocol/Internet Protocol', 'Transmission Control Protocol/Internet Protocol', 'Transfer Code Protocol/Internal Protocol', 'Transmission Code Protocol/Internet Program', 1),
        ('SA2', 'What is DNS?', 'Data Network System', 'Domain Name System', 'Dynamic Network Service', 'Data Node System', 1),
        ('SA3', 'What is a subnet mask?', 'A network filter', 'Divides IP addresses into network and host portions', 'A firewall rule', 'A routing protocol', 1),
        ('SA4', 'What is DHCP?', 'Dynamic Host Configuration Protocol', 'Data Host Control Protocol', 'Dynamic HTTP Control Protocol', 'Data Host Configuration Program', 0),
        ('SA5', 'What is the purpose of a switch in networking?', 'Connect different networks', 'Connect devices within same network', 'Provide internet access', 'Filter web traffic', 1),
        ('SA6', 'What does OSI stand for?', 'Open System Interface', 'Open Systems Interconnection', 'Online System Integration', 'Open Source Interface', 1),
        ('SA7', 'What is SSH used for?', 'Web browsing', 'Secure remote access to servers', 'File downloading', 'Email sending', 1),
        ('SA8', 'What is a MAC address?', 'Apple computer address', 'Unique hardware identifier for network devices', 'A type of IP address', 'A network protocol', 1),
        ('SA9', 'What is load balancing?', 'Measuring server weight', 'Distributing network traffic across servers', 'Balancing storage space', 'Equalizing CPU usage', 1),
        ('SA10', 'What is RAID in storage?', 'Random Access in Disk', 'Redundant Array of Independent Disks', 'Rapid Array of Internal Devices', 'Remote Array of Independent Disks', 1),
    ],
    'QA': [
        ('QA1', 'What is unit testing?', 'Testing the entire system', 'Testing individual components', 'Testing user interfaces', 'Testing network connections', 1),
        ('QA2', 'What is regression testing?', 'Testing new features only', 'Re-testing after changes to ensure existing features work', 'Testing for performance', 'Testing security', 1),
        ('QA3', 'What does QA stand for?', 'Quick Access', 'Quality Assurance', 'Query Analysis', 'Queue Application', 1),
        ('QA4', 'What is Selenium used for?', 'Database testing', 'Web browser automation testing', 'Mobile testing', 'API testing', 1),
        ('QA5', 'What is a test case?', 'A software bug', 'A set of conditions to verify software behavior', 'A testing tool', 'A programming concept', 1),
        ('QA6', 'What is black-box testing?', 'Testing with knowledge of code', 'Testing without knowledge of internal code', 'Testing in dark environments', 'Testing hardware', 1),
        ('QA7', 'What is performance testing?', 'Testing code quality', 'Testing system speed, stability and scalability', 'Testing UI design', 'Testing database', 1),
        ('QA8', 'What is a bug in software?', 'A computer insect', 'An error or flaw in software', 'A feature request', 'A design element', 1),
        ('QA9', 'What is agile testing?', 'Fast testing only', 'Testing integrated throughout agile development', 'Testing at end only', 'Manual testing only', 1),
        ('QA10', 'What is smoke testing?', 'Testing in smoky environments', 'Basic testing to check core functionality works', 'Performance testing', 'Security testing', 1),
    ],
    'UI': [
        ('UI1', 'What does UI stand for?', 'User Interaction', 'User Interface', 'Unified Interface', 'User Integration', 1),
        ('UI2', 'What does UX stand for?', 'User Execution', 'User Experience', 'Unified Experience', 'User Extension', 1),
        ('UI3', 'What is Figma used for?', 'Database management', 'UI/UX design and prototyping', 'Web development', 'Mobile development', 1),
        ('UI4', 'What is a wireframe?', 'A metal structure', 'A basic layout sketch of a design', 'A type of code', 'A database schema', 1),
        ('UI5', 'What is a prototype in UI/UX?', 'A finished product', 'An interactive model of a design', 'A programming concept', 'A database', 1),
        ('UI6', 'What is user research in UX?', 'Researching about computers', 'Studying users to understand their needs', 'Writing code', 'Creating graphics', 1),
        ('UI7', 'What is accessibility in design?', 'Fast loading speed', 'Designing for all users including those with disabilities', 'Colorful design', 'Mobile design', 1),
        ('UI8', 'What is a design system?', 'A computer system', 'A collection of reusable design components', 'A programming system', 'A database system', 1),
        ('UI9', 'What is usability testing?', 'Testing code performance', 'Testing how easily users can use a product', 'Security testing', 'Network testing', 1),
        ('UI10', 'What is responsive design?', 'Fast responding emails', 'Design that adapts to different screen sizes', 'Animated design', 'Colorful design', 1),
    ],
    'DA': [
        ('DA1', 'What is Power BI?', 'A programming language', 'A business analytics tool by Microsoft', 'A database', 'A web framework', 1),
        ('DA2', 'What is Tableau used for?', 'Programming', 'Data visualization', 'Database management', 'Web development', 1),
        ('DA3', 'What is a KPI?', 'Key Performance Indicator', 'Key Program Interface', 'Knowledge Performance Index', 'Key Processing Input', 0),
        ('DA4', 'What is data visualization?', 'Storing data', 'Representing data graphically', 'Deleting data', 'Encrypting data', 1),
        ('DA5', 'What is ETL in data analytics?', 'Extract, Transform, Load', 'Edit, Transfer, Link', 'Extract, Transfer, Link', 'Edit, Transform, Load', 0),
        ('DA6', 'What is a dashboard in BI?', 'A car component', 'A visual display of key metrics', 'A database table', 'A coding interface', 1),
        ('DA7', 'What is data cleaning?', 'Washing computers', 'Fixing errors and inconsistencies in data', 'Deleting all data', 'Encrypting data', 1),
        ('DA8', 'What is a pivot table?', 'A rotating table', 'A data summarization tool in spreadsheets', 'A database index', 'A chart type', 1),
        ('DA9', 'What is descriptive analytics?', 'Predicting future', 'Analyzing historical data to understand what happened', 'Prescribing solutions', 'Real-time analysis', 1),
        ('DA10', 'What is a data warehouse?', 'A physical building', 'A large repository for storing historical data', 'A small database', 'A cloud service', 1),
    ],
    'ES': [
        ('ES1', 'What is an embedded system?', 'A system embedded in software', 'A computer system designed for specific tasks within hardware', 'A cloud system', 'A database system', 1),
        ('ES2', 'What is Arduino?', 'A programming language', 'An open-source microcontroller platform', 'A cloud service', 'A database', 1),
        ('ES3', 'What is Raspberry Pi?', 'A math constant', 'A small single-board computer', 'A programming language', 'A network protocol', 1),
        ('ES4', 'What does IoT stand for?', 'Internet of Technology', 'Internet of Things', 'Interface of Technology', 'Integration of Things', 1),
        ('ES5', 'What is a microcontroller?', 'A small keyboard', 'A compact integrated circuit for controlling devices', 'A type of monitor', 'A network device', 1),
        ('ES6', 'What is RTOS?', 'Remote Transfer Operating System', 'Real-Time Operating System', 'Rapid Task Operating System', 'Remote Task Operating System', 1),
        ('ES7', 'What language is commonly used in Arduino?', 'Python', 'Java', 'C/C++', 'JavaScript', 2),
        ('ES8', 'What is a sensor in IoT?', 'A network device', 'A device that detects physical properties', 'A programming concept', 'A storage device', 1),
        ('ES9', 'What is MQTT in IoT?', 'A programming language', 'A lightweight messaging protocol for IoT', 'A database', 'A cloud service', 1),
        ('ES10', 'What is firmware?', 'A type of software stored in hardware', 'A network protocol', 'A database', 'A web framework', 0),
    ],
}

with app.app_context():
    # Clear existing data
    QuizQuestion.query.delete()
    QuizCategory.query.delete()
    db.session.commit()

    # Add categories
    cat_map = {}
    for cat_data in CATEGORIES:
        cat = QuizCategory(
            code=cat_data['code'],
            name=cat_data['name'],
            icon=cat_data['icon'],
            description=cat_data['description'],
            question_count=10
        )
        db.session.add(cat)
        db.session.flush()
        cat_map[cat_data['code']] = cat.id

    db.session.commit()

    # Add questions
    total = 0
    for cat_code, questions in QUESTIONS.items():
        cat_id = cat_map.get(cat_code)
        if not cat_id:
            continue
        for q in questions:
            question = QuizQuestion(
                category_id=cat_id,
                question_code=q[0],
                question_text=q[1],
                option_a=q[2],
                option_b=q[3],
                option_c=q[4],
                option_d=q[5],
                correct_option=q[6],
                marks=10
            )
            db.session.add(question)
            total += 1

    db.session.commit()
    print(f'✅ Seeded {len(CATEGORIES)} categories and {total} questions!')