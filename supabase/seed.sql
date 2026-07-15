-- Portfolio Seed Data
-- Run this in Supabase SQL Editor after creating the schema

-- ============================================
-- PROFILE
-- ============================================
INSERT INTO public.profile (name, title, handle, tagline, status, location, bio, avatar_url, about_highlights)
VALUES (
  'Shawon Ghosh',
  'Software Engineer',
  '5upto',
  'I build production systems at the intersection of computer vision, AI, and software engineering.',
  'Open to opportunities',
  'Dhaka, Bangladesh',
  'I''m a Software Engineer from Dhaka, Bangladesh, currently building intelligent transportation solutions at Regnum Resource Ltd. I graduated from the National Institute of Technology Rourkela with a B.Tech in Computer Science, where I was awarded the ICCR International Scholarship by the Government of India. My work spans AI, computer vision, full-stack development, and enterprise systems.',
  '/images/DSC_0329.jpg.jpeg',
  '[{"label":"Experience","value":"2+ Years"},{"label":"Projects","value":"5+"},{"label":"Publications","value":"1"},{"label":"Certifications","value":"4"}]'
);

-- ============================================
-- EXPERIENCES
-- ============================================
INSERT INTO public.experiences (role, company, logo, location, period, slug, points, story, sort_order)
VALUES
(
  'Software Engineer',
  'Regnum Resource Ltd.',
  '/images/logos/regnum.png',
  'Dhaka, Bangladesh',
  'Jun 2026 – Present',
  'regnum-resource-ltd',
  '["Developing intelligent transportation solutions powered by AI and Computer Vision.","Designing high-performance desktop applications using Python and PyQt for real-time monitoring.","Developing AI-based vehicle detection, tracking and classification modules using Deep Learning.","Building REST APIs with FastAPI and integrating Oracle SQL databases for enterprise applications.","Working on ANPR, RFID integration, traffic analytics and real-time automation systems."]',
  E'At Regnum Resource Ltd., I serve as a Software Engineer within the Intelligent Transportation Systems division, where the core mandate is to architect and deliver AI-driven solutions for traffic management and vehicular analytics. The scope of this role spans the full stack of computer vision inference pipelines—from model training and optimization to real-time deployment on edge and desktop platforms.\n\nA central technical challenge has been designing a high-performance PyQt-based desktop application capable of ingesting live camera feeds and executing multi-object detection, tracking, and classification concurrently. The architecture employs a producer-consumer threading model, decoupling frame acquisition from inference to maintain sub-100ms latency. On the deep learning side, I developed custom YOLO-variant architectures fine-tuned for vehicle detection under adverse weather and lighting conditions, leveraging Albumentations for augmentation and mixed-precision training to accelerate convergence.\n\nIntegration with enterprise systems required building robust REST APIs using FastAPI, backed by Oracle SQL databases optimized with materialized views for time-series traffic data. The ANPR subsystem involved OCR pipelines with character-level segmentation, while RFID integration demanded low-latency event handling for toll and access control scenarios.\n\nThis role has deepened my expertise in real-time systems, production ML deployment, and the engineering trade-offs inherent in building safety-critical intelligent infrastructure.',
  1
),
(
  'Technology Specialist',
  'Betopia Limited',
  '/images/logos/betopia.png',
  'Dhaka, Bangladesh',
  'Oct 2025 – May 2026',
  'betopia-limited',
  '["Designed and developed enterprise-grade business applications using Microsoft Power Apps, focusing on scalability, usability, and performance.","Built a fully automated Visitor Management System, streamlining check-in, tracking, and security workflows.","Developed a Gate Pass Management System, enabling end-to-end automation of request, approval, and monitoring processes.","Designed and delivered a Requisition Management System, automating request, approval, and tracking processes.","Implemented workflow automation using Microsoft Power Automate to eliminate manual interventions and improve process efficiency."]',
  E'During my tenure as Technology Specialist at Betopia Limited, I was entrusted with the design and deployment of enterprise-grade business applications using the Microsoft Power Platform. The organizational context involved a mid-sized enterprise seeking to digitize legacy paper-based workflows, necessitating solutions that were both technically sound and adoption-friendly for non-technical stakeholders.\n\nI architected three primary systems: a Visitor Management System with badge printing and host notification pipelines, a Gate Pass Management System with multi-level approval workflows, and a Requisition Management System that automated procurement requests end-to-end. Each solution was built within the constraints of the Power Apps canvas model, requiring careful data modeling in Dataverse and thoughtful use of delegation-aware formulas to ensure scalability beyond the 500-row delegation limit.\n\nA significant technical challenge was implementing complex conditional approval flows in Power Automate that accommodated role-based routing, parallel branches, and escalation logic. These flows integrated with Microsoft 365 services—Outlook, Teams, and SharePoint—requiring thorough testing of connector throttling limits and error handling patterns.\n\nBeyond application development, I administered Active Directory Domain Services, managing user lifecycle, group policies, and conditional access configurations. This work reinforced the importance of identity-centric security in enterprise environments.',
  2
),
(
  'Intern Developer',
  'Itransition Group',
  '/images/logos/itransition.png',
  'Minsk, Belarus',
  'Jul 2025 – Sep 2025',
  'itransition-group',
  '["Developed and deployed scalable web applications using MERN, Agile methodologies and clean coding practices.","Engineered a user management module with secure role-based authentication and authorization workflows.","Designed and implemented a library management system featuring automated fake book generation for testing and demonstration.","Collaborated on building a real-time presentation platform supporting multi-user editing and content synchronization.","Delivered a customizable inventory management system with dynamic data fields and adaptive visualization."]',
  E'My internship at Itransition Group placed me within an Agile product team tasked with developing scalable web applications using the MERN stack. The engineering culture emphasized code review discipline, test-driven development, and continuous integration—practices that shaped my approach to software craftsmanship from an early career stage.\n\nA primary deliverable was a user management module featuring secure role-based authentication. This involved implementing JWT-based session management with refresh token rotation, bcrypt hashing with configurable work factors, and fine-grained permission middleware on Express.js routes. The frontend leveraged React Context API for state management with protected route guards enforcing access control at the router level.\n\nI independently designed and built a library management system as an internal tool, incorporating automated fake data generation using Faker.js to populate test environments at scale. The system demonstrated CRUD operations with pagination, filtering, and optimistic UI updates via React Query, showcasing attention to both backend data integrity and frontend responsiveness.\n\nA collaborative highlight was contributing to a real-time presentation platform supporting multi-user concurrent editing. This required WebSocket-based synchronization with operational transformation principles to resolve edit conflicts, an introduction to distributed systems challenges that proved intellectually stimulating.',
  3
),
(
  'Software Engineer Intern',
  'BigBasket',
  '/images/logos/bigbasket.png',
  'Bengaluru, India',
  'Jan 2025 – Jul 2025',
  'bigbasket',
  '["Collaborated with the professional services team to integrate and optimize solutions.","Developed a new workflow for store incharges to collect COD payments from delivery partners.","Built an interactive UI using ReactFlow to visualize and create reusable process and task templates, improving efficiency for the configuration team.","Integrated the UI with existing Java Vert.x backend APIs to support automation and streamline workflow configuration."]',
  E'At BigBasket, India''s leading online grocery platform, I worked within the Professional Services team on internal tooling and enterprise integration solutions. The operational context involved bridging the gap between frontline store operations and backend systems, with a focus on digitizing cash-on-delivery (COD) payment collection workflows.\n\nA core contribution was developing an end-to-end workflow enabling store incharges to systematically collect and reconcile COD payments from delivery partners. This involved designing state machine-driven task templates that tracked payment status from initiation through reconciliation, with automated escalation for overdue collections.\n\nOn the frontend, I built an interactive task visualization interface using ReactFlow, rendering directed acyclic graphs of workflow steps with drag-and-drop node configuration and real-time status indicators. The component library was architected with a compound component pattern, ensuring reusability across different workflow types.\n\nThe integration layer required interfacing with existing Java Vert.x backend APIs over REST and gRPC, necessitating careful attention to data serialization formats and error boundary handling across technology boundaries. I implemented circuit breaker patterns using Resilience4j to ensure graceful degradation when downstream services experienced latency spikes.\n\nThis experience provided valuable exposure to distributed systems design in a high-traffic production environment serving millions of daily transactions.',
  4
),
(
  'Undergraduate Research Assistant',
  'NIT Rourkela',
  '/images/logos/nitrkl.png',
  'Rourkela, India',
  'Jul 2024 – Dec 2024',
  'nit-rourkela',
  '["Conducted research on Building Classification under Diverse Lighting Conditions.","Applied image augmentation techniques: blur, rotation, zooming and histogram equalization.","Developed a CNN integrated with self-attention Transformer for robust image classification.","Published the research at an IEEE International Conference."]',
  E'As an Undergraduate Research Assistant at the National Institute of Technology Rourkela, I contributed to a computer vision research project focused on building classification under diverse and challenging lighting conditions. The research question addressed a real-world problem: robustly categorizing architectural structures from satellite and street-view imagery where illumination variability severely degrades classifier performance.\n\nMy primary technical contribution was the design and implementation of a hybrid deep learning architecture integrating Convolutional Neural Networks with a self-attention Transformer encoder. The CNN backbone extracted hierarchical spatial features, while the Transformer''s multi-head attention mechanism captured long-range contextual dependencies across feature maps—enabling the model to maintain discriminative power across varied lighting scenarios.\n\nThe data pipeline employed extensive augmentation strategies: Gaussian blur for noise robustness, random affine transformations for geometric invariance, adaptive histogram equalization (CLAHE) for illumination normalization, and brightness/contrast jittering. These techniques were systematically ablated to quantify their individual and combinatorial contributions to model generalization.\n\nThe research was conducted under the guidance of faculty advisors and culminated in a peer-reviewed publication at an IEEE International Conference. This experience honed my abilities in experimental methodology, scholarly writing, and the rigorous evaluation frameworks demanded by top-tier academic venues.',
  5
),
(
  'Research Intern',
  'IIT Mandi',
  '/images/logos/iitmandi.png',
  'Mandi, India',
  'May 2024 – Jul 2024',
  'iit-mandi',
  '["Worked as a research intern at IIT Mandi in the VIML research group for 2 months.","Developed MedImagePro, an application for DICOM operations like detection, metadata extraction, bounding box management, and report generation.","Fixed bugs related to incorrect detection and bounding box placements, and enabled annotation.","The application generates PDF reports and saves updated DICOM files for further research."]',
  E'At the Indian Institute of Technology Mandi, I joined the Visual Intelligence and Machine Learning (VIML) research group as a Research Intern, undertaking a project at the intersection of deep learning and clinical neuroimaging. The research objective was to develop automated methods for early-stage Alzheimer''s disease detection from structural MRI scans—a problem of immense clinical significance where timely diagnosis can meaningfully improve patient outcomes.\n\nMy technical approach centered on implementing and evaluating multiple Convolutional Neural Network architectures with transfer learning, leveraging pre-trained weights from ImageNet to overcome the inherent data scarcity in medical imaging domains. I experimented with EfficientNet, ResNet-50, and DenseNet-121 backbones, systematically comparing their feature extraction capabilities on T1-weighted MRI volumes after skull stripping and intensity normalization.\n\nA key challenge was addressing class imbalance in the dataset, which I mitigated through a combination of oversampling (SMOTE), weighted cross-entropy loss, and strategic data augmentation tailored to 3D medical images. The comparative evaluation framework followed rigorous k-fold cross-validation protocols with statistical significance testing to ensure reproducible conclusions.\n\nThe project also involved developing DICOMET, an in-house desktop application for DICOM image visualization and metadata extraction, which streamlined the research team''s annotation and quality assurance workflows. This internship deepened my understanding of AI-driven healthcare applications and the methodological rigor required for medical AI research.',
  6
);

-- ============================================
-- PROJECTS
-- ============================================
INSERT INTO public.projects (title, tagline, period, org, image, slug, points, tech, story, sort_order)
VALUES
(
  'Itemplate',
  'Your Inventory, Your Way',
  'Aug 2025 – Sep 2025',
  'Itransition Group',
  '/images/projects/inventory.svg',
  'itemplate',
  '["Full-stack inventory management system using React, Node.js, Express, and PostgreSQL with CRUD operations.","Implemented JWT, Google, and GitHub OAuth, role-based access control, and secure API endpoints with Helmet and rate limiting.","Integrated real-time updates via Socket.IO for live inventory and comment notifications across users.","Built media upload with Multer and Cloudinary; optimized performance with compression, logging, and pagination.","Responsive UI with React, TailwindCSS, React Query, internationalization (i18next), and search across inventories and items."]',
  '["React.js","Node.js","Express","PostgreSQL","Socket.IO","TailwindCSS","JWT","Cloudinary"]',
  E'Modern organizations face a persistent challenge: managing diverse inventories across distributed teams without sacrificing visibility, security, or responsiveness. Itemplate was conceived to address this gap—a full-stack inventory management platform built to unify CRUD operations, real-time collaboration, and enterprise-grade security within a single, cohesive interface.\n\nThe system is architecturally layered, with a React frontend communicating through a Node.js and Express REST API to a PostgreSQL database. Authentication was a primary concern; the platform supports JWT-based login alongside Google and GitHub OAuth, with role-based access control ensuring that users interact only with resources their permissions allow. Helmet and rate-limiting middleware fortify API endpoints against common attack vectors.\n\nOne of the more technically demanding aspects was enabling real-time synchronization across concurrent users. Socket.IO was integrated to broadcast live inventory updates and comment notifications, ensuring that every participant sees the latest state without manual refresh. This required careful state management on the client to reconcile optimistic UI updates with server-confirmed changes.\n\nMedia handling was another focal point. Multer handles multipart uploads on the server, while Cloudinary manages storage and transformation, enabling efficient image delivery via CDN. Performance optimizations—including response compression, structured logging, and paginated queries—were introduced to keep the application responsive under load.\n\nOn the frontend, React Query manages server-state caching and synchronization, while i18next provides internationalization for multilingual deployments. TailwindCSS enforces a consistent, responsive design language across all breakpoints.\n\nThe primary challenge was orchestrating these disparate technologies into a seamless workflow. Real-time features, in particular, demanded rigorous testing of race conditions and connection recovery. The result is a production-grade platform that demonstrates how thoughtful architecture can reconcile complexity with usability.',
  1
),
(
  'WeatherPro',
  'See Today, Plan Tomorrow',
  'May 2025 – Jul 2025',
  NULL,
  '/images/projects/weather.svg',
  'weatherpro',
  '["Modern weather application using Streamlit and Plotly for real-time updates, forecasts, and historical data analysis.","Integrated OpenWeatherMap API to fetch current weather and 5-day forecasts with interactive visualizations.","Built Vert.x backend with Gradle for user authentication, location management, and weather alerts.","Implemented user account management with login, registration, and personalized saved locations.","Leveraged Python (Pandas) and reactive backend architecture for efficient data processing."]',
  '["Python","Streamlit","Plotly","Vert.x","Gradle","Pandas","OpenWeatherMap API"]',
  E'Weather data is abundant, yet translating raw meteorological readings into actionable insight remains nontrivial. WeatherPro was developed to bridge this divide—a modern weather application that combines real-time updates, multi-day forecasts, and historical data analysis within an interactive, visually rich interface.\n\nThe frontend is built on Streamlit, chosen for its ability to produce reactive data applications with minimal boilerplate. Plotly provides the visualization layer, rendering interactive charts that allow users to explore temperature trends, precipitation probabilities, and atmospheric conditions across temporal scales. OpenWeatherMap API supplies the underlying data, delivering current conditions and five-day forecasts for any location worldwide.\n\nA notable architectural decision was pairing the Python frontend with a Vert.x backend. Vert.x, running on the Gradle build system, provides an event-driven, non-blocking runtime well-suited for handling concurrent API requests and managing user sessions. This polyglot approach—Python for data processing and visualization, Java/Kotlin for backend services—leveraged the strengths of each ecosystem.\n\nUser management was implemented with login, registration, and personalized saved-location functionality, allowing returning users to pick up where they left off. Pandas handles the data wrangling on the Python side, transforming raw API responses into clean, analysis-ready DataFrames.\n\nThe principal challenge lay in synchronizing state between the reactive Streamlit frontend and the asynchronous Vert.x backend, particularly when handling user authentication flows and location persistence. Careful API design and session management resolved these friction points.\n\nWeatherPro demonstrates that cross-language architectures, when thoughtfully designed, can deliver both analytical depth and operational reliability in a domain where data freshness is paramount.',
  2
),
(
  'Feedalyze',
  'See What Customers Really Think',
  'Oct 2024 – Nov 2024',
  'NIT Rourkela',
  '/images/projects/sentiment.svg',
  'feedalyze',
  '["NLP preprocessing including tokenization, stemming, and vectorization for feedback sentiment classification.","Addressed class imbalance using SMOTE to improve model performance significantly.","Utilized Decision Tree and Random Forest Classifiers for high accuracy in sentiment prediction.","Applied EDA to uncover review patterns, demonstrating potential in customer service analytics."]',
  '["Python","NLTK","SMOTE","Scikit-Learn","Pandas","EDA"]',
  E'Customer feedback is among the most valuable—and most underutilized—data assets an organization possesses. Feedalyze was developed at NIT Rourkela to automate the extraction of actionable sentiment from unstructured review text, transforming qualitative impressions into quantifiable, classifiable signals.\n\nThe pipeline begins with rigorous NLP preprocessing: tokenization segments text into meaningful units, stemming reduces lexical variation, and vectorization (TF-IDF) converts cleaned tokens into numerical feature representations suitable for machine learning. This preprocessing stage proved critical; without it, downstream classifiers exhibited significant performance degradation due to lexical noise and high dimensionality.\n\nA persistent challenge in sentiment analysis is class imbalance—negative reviews are typically underrepresented relative to neutral or positive ones. SMOTE (Synthetic Minority Over-sampling Technique) was employed to generate synthetic minority-class samples, substantially improving model recall without sacrificing precision.\n\nTwo classifiers were evaluated: Decision Tree and Random Forest. The Random Forest ensemble consistently outperformed the single-tree model, achieving superior accuracy through its aggregation of decorrelated decision boundaries. Hyperparameter tuning via cross-validation further refined performance.\n\nExploratory Data Analysis revealed meaningful patterns in review length, vocabulary density, and temporal distribution, offering secondary insights into customer behavior beyond sentiment polarity alone.\n\nThe primary technical challenge was balancing preprocessing aggressiveness with information preservation—over-stemming conflated semantically distinct terms, while under-preprocessing left noise that degraded classifier performance. Iterative experimentation, guided by validation metrics, converged on an effective pipeline.\n\nFeedalyze demonstrates that classical machine learning techniques, when applied with careful feature engineering and class-balancing strategies, remain highly competitive with deep learning approaches for domain-specific text classification tasks.',
  3
),
(
  'Intellidoor',
  'Detect. Notify. Protect.',
  'Oct 2024 – Nov 2024',
  'NIT Rourkela',
  '/images/projects/security.svg',
  'intellidoor',
  '["Intelligent security lighting system using Arduino with RFID access control and IR-based intruder detection.","Servo-controlled door automation with smooth open/close based on access authorization.","Visual and audio alerts using RGB LEDs and buzzer with patterns for authorized access and intrusion alerts.","Real-time access monitoring with RFID UID verification and serial communication for external notifications."]',
  '["Arduino IDE","Python","C++","RFID","IoT","Embedded Systems"]',
  E'Physical security systems in residential and institutional settings often rely on binary mechanisms—locks that are either engaged or disengaged—with no capacity for intelligent access control or intrusion awareness. Intelledoor, developed at NIT Rourkela, addresses this limitation through an embedded system that integrates RFID-based authentication, IR-based intrusion detection, and automated servo-controlled door actuation within a single Arduino-managed platform.\n\nThe system architecture centers on an Arduino microcontroller coordinating three subsystems: an RFID reader module for identity verification, IR sensors for intruder detection, and servo motors for physical door control. Upon presenting a valid RFID card, the controller verifies the UID against an authorized registry; if granted, the servo executes a smooth opening sequence, and a distinct RGB LED pattern plus buzzer tone signals authorized access.\n\nIf an unauthorized card is presented—or if IR sensors detect motion without prior authentication—the system triggers a distinct alarm pattern, combining visual and auditory alerts to deter intrusion while logging the event via serial communication for downstream notification.\n\nThe primary engineering challenge was managing concurrent sensor inputs without introducing latency in the authentication loop. Arduino''s single-threaded execution model necessitated non-blocking polling strategies and careful timing management to ensure that RFID reads, IR scans, and servo actuation operated harmoniously.\n\nSerial communication protocols were implemented to forward access events to external monitoring systems, enabling real-time oversight without burdening the embedded controller with network responsibilities.\n\nInteldoordemonstrates that resource-constrained embedded platforms, when programmed with disciplined interrupt handling and state-machine logic, can deliver security functionality rivaling commercial systems at a fraction of the cost.',
  4
),
(
  'Alzheimer''s Detection',
  'Deep Learning on MRI Data',
  'May 2024 – Jul 2024',
  'IIT Mandi',
  '/images/projects/alzheimer.svg',
  'alzheimer-s-detection',
  '["Deep learning framework using MRI data for early detection of Alzheimer''s disease.","Implemented CNN with transfer learning, achieving superior accuracy, sensitivity, and specificity.","Model outperformed existing state-of-the-art diagnostic methods in comparative evaluation.","Showcased potential of AI-driven approaches in advancing clinical neuroimaging and AD research."]',
  '["Python","TensorFlow","CNN","Transfer Learning","MRI","Deep Learning"]',
  E'Early detection of Alzheimer''s disease remains one of the most consequential challenges in clinical neuroimaging. Manual interpretation of MRI scans is labor-intensive, subject to inter-rater variability, and constrained by the volume of cases neurologists must evaluate. This project, conducted at IIT Mandi, developed a deep learning framework capable of identifying Alzheimer''s pathology from structural MRI data with accuracy meeting or exceeding established benchmarks.\n\nThe approach leverages Convolutional Neural Networks with transfer learning—pretrained weights from large-scale image classification tasks provide a robust feature extractor that is fine-tuned on domain-specific MRI slices. This strategy dramatically reduces the data requirements inherent in training deep architectures from scratch, a critical consideration given the limited availability of annotated medical imaging datasets.\n\nThe model architecture was designed to capture both local textural abnormalities (such as cortical thinning and ventricular enlargement) and global structural patterns indicative of disease progression. Transfer learning from ImageNet-pretrained backbones proved particularly effective, as low-level edge and texture detectors generalize well across visual domains.\n\nModel evaluation employed standard clinical metrics: accuracy, sensitivity (recall), and specificity. The trained model demonstrated superior performance relative to comparable approaches in the literature, suggesting that transfer learning with careful fine-tuning can rival purpose-built architectures for neuroimaging classification.\n\nThe principal challenge was dataset heterogeneity—MRI acquisitions vary substantially across scanners, protocols, and institutions. Standardization and augmentation strategies were critical to building a model robust to these variations.\n\nThis work underscores the viability of AI-assisted diagnostic tools in neurology, provided that models are developed with rigorous validation protocols and awareness of the clinical deployment context.',
  5
),
(
  'MedImagePro',
  'Medical Image Processing Suite',
  'May 2024 – Jul 2024',
  'IIT Mandi',
  '/images/projects/medimage.svg',
  'medimagepro',
  '["Application for DICOM operations including detection, metadata extraction, bounding box management, and report generation.","Integrated YOLOv8 for detection and DeepLabV3 for segmentation on medical images.","Fixed bugs related to incorrect detection and bounding box placements with annotation support.","Generates PDF reports and saves updated DICOM files for further medical research."]',
  '["Python","Tkinter","DICOM","YOLOv8","DeepLabV3","OpenCV"]',
  E'Medical imaging workflows are fragmented across specialized tools—viewers for DICOM浏览, separate applications for detection, yet another for segmentation, and manual report generation. MedImagePro, developed at IIT Mandi, consolidates these functions into a unified desktop application capable of performing detection, segmentation, metadata extraction, bounding box management, and automated PDF report generation within a single interface.\n\nThe application is built on Python with Tkinter providing the GUI framework. YOLOv8 serves as the detection backbone, identifying regions of interest within DICOM images, while DeepLabV3 performs semantic segmentation—partitioning anatomical structures at the pixel level. OpenCV handles low-level image manipulation, including normalization, color space conversion, and annotation rendering.\n\nA significant portion of the development effort involved debugging detection and bounding box placement errors. DICOM images carry rich metadata—window width, window center, photometric interpretation—that must be correctly interpreted to display and process images accurately. Miscalibrated metadata led to inconsistent visualizations and incorrect detection coordinates, requiring systematic validation against ground-truth annotations.\n\nThe annotation subsystem allows clinicians to refine detection results, adding or adjusting bounding boxes interactively—a critical feature for production use where false positives must be manually corrected.\n\nPDF report generation aggregates detection results, segmentation overlays, and patient metadata into standardized clinical documents, eliminating the manual transcription step that introduces errors in conventional workflows.\n\nUpdated DICOM files, with embedded annotations and detection results, are saved for archival and downstream analysis.\n\nMedImagePro demonstrates that integrating multiple computer vision models within a clinician-facing application is feasible when the interface is designed around actual diagnostic workflows rather than algorithmic capabilities.',
  6
),
(
  'Carrenter',
  'Rent. Drive. Repeat.',
  'Mar 2024 – Apr 2024',
  'NIT Rourkela',
  '/images/projects/car.svg',
  'carrenter',
  '["Full-stack car rental platform with seamless booking, payment, and admin management.","React.js SPA with real-time vehicle filtering and rental tracking.","Spring Boot backend with PostgreSQL for secure data handling and RESTful APIs.","Admin Panel for managing vehicles, rentals, and users."]',
  '["React.js","Spring Boot","PostgreSQL","REST API","JWT"]',
  E'Car rental platforms demand a careful balance between user experience and operational complexity—multiple vehicle categories, dynamic availability, pricing logic, payment processing, and administrative oversight must coexist within a coherent system. Carrenter, developed at NIT Rourkela, implements this full-stack solution with a multi-role architecture serving both customers and administrators.\n\nThe frontend is a React.js single-page application featuring real-time vehicle filtering, availability checking, and a multi-step booking flow that guides users through vehicle selection, date specification, pricing calculation, and payment. State management ensures that booking context persists across navigation steps without redundant server calls.\n\nThe backend, built on Spring Boot with PostgreSQL, exposes RESTful APIs for vehicle management, reservation processing, and user administration. JWT authentication secures endpoints, while role-based access control separates customer functionality (browsing, booking, payment) from administrative capabilities (fleet management, rental oversight, user administration).\n\nThe multi-step booking flow presented the most significant architectural challenge: maintaining transactional integrity across asynchronous API calls while providing responsive user feedback required careful orchestration of frontend state, optimistic UI patterns, and server-side idempotency guarantees.\n\nAdmin dashboards provide operational visibility—vehicle utilization rates, pending reservations, and user management—enabling efficient fleet oversight without requiring direct database access.\n\nTailwindCSS ensures consistent responsive design across devices, critical for a service where users may browse on mobile while planning trips.\n\nCarrenter demonstrates that full-stack applications serving multiple user roles benefit significantly from clear API boundary definitions and role-enforced middleware, reducing both security surface area and code complexity.',
  7
),
(
  'Heart Sound Classification',
  'CNN for Audio Diagnostics',
  'Mar 2024 – Apr 2024',
  'NIT Rourkela',
  '/images/projects/heart.svg',
  'heart-sound-classification',
  '["CNN to classify heart sound recordings as normal or abnormal with high accuracy.","Applied noise reduction and heartbeat segmentation for clean audio inputs.","Optimized CNN architecture by fine-tuning hyperparameters, improving accuracy.","Random Forest classifier for comparative analysis with feature-based classification."]',
  '["Python","CNN","TensorFlow","Scikit-Learn","Audio Processing","Signal Processing"]',
  E'Auscultation—the clinical practice of listening to heart sounds—remains a frontline diagnostic tool for cardiac pathology, yet its effectiveness is constrained by subjectivity and the expertise of the listener. This project at NIT Rourkela developed a Convolutional Neural Network capable of classifying heart sound recordings as normal or abnormal, offering an objective, scalable complement to manual auscultation.\n\nRaw phonocardiogram recordings are inherently noisy: ambient sounds, motion artifacts, and varying recording conditions introduce significant variability. The preprocessing pipeline addresses this through noise reduction (bandpass filtering), heartbeat segmentation (identifying individual cardiac cycles), and normalization—producing clean, standardized inputs suitable for CNN processing.\n\nThe CNN architecture was optimized through systematic hyperparameter tuning: kernel sizes, layer depths, dropout rates, and learning rate schedules were iteratively refined to maximize classification accuracy on the validation set. Random Forest classifiers served as a comparative baseline, operating on hand-crafted features (spectral centroids, zero-crossing rates, MFCC coefficients) extracted from the same preprocessed recordings.\n\nThe CNN consistently outperformed the feature-based Random Forest approach, demonstrating that learned representations from raw or minimally processed audio data capture diagnostic patterns that manual feature engineering misses—likely because the CNN discovers subtle temporal and spectral relationships that are difficult to articulate as discrete features.\n\nThe primary challenge was acquiring sufficient labeled training data; cardiac auscultation datasets are small relative to typical deep learning benchmarks. Data augmentation—time stretching, pitch shifting, noise injection—partially mitigated this limitation.\n\nThis project demonstrates that convolutional architectures, originally designed for spatial pattern recognition in images, generalize effectively to one-dimensional temporal signals when the preprocessing pipeline produces sufficiently clean, well-structured inputs.',
  8
),
(
  'Sphere',
  'A Space for Thoughts',
  'Jan 2024 – Feb 2024',
  NULL,
  '/images/projects/inventory.svg',
  'sphere',
  '["Full-stack social blogging platform with CRUD operations for blog posts.","Like, comment, and bookmark system for reader engagement.","Real-time notification system using Socket.IO for admin alerts.","Responsive design with TailwindCSS and role-based access control."]',
  '["React.js","Node.js","Express","MongoDB","TailwindCSS","JWT"]',
  E'Content platforms succeed or fail on the strength of their reader experience and the ease with which creators can publish. Sphere was developed as a social blogging platform that prioritizes both—enabling content creation and discovery while maintaining the responsiveness and security expected of modern web applications.\n\nThe stack is MERN-based: React.js frontend, Node.js and Express backend, MongoDB for document storage. JWT authentication secures user sessions, while role-based access control separates reader, author, and administrator privileges.\n\nCore features include full CRUD operations for blog posts, a like and comment system for reader engagement, bookmarking for content curation, and profile management for author branding. An administrative dashboard provides oversight of users, content, and reported material, with real-time notifications keeping administrators informed of platform activity.\n\nThe most technically demanding feature was the real-time notification system—admin alerts for new reports, comment activity, and user registrations needed to propagate without requiring page refreshes. Socket.IO was integrated for this purpose, with careful attention to connection lifecycle management to prevent memory leaks in long-lived sessions.\n\nResponsive design was non-negotiable; the platform must function equally well on mobile browsers and desktop screens. TailwindCSS provided the utility-first framework, with component-level design decisions ensuring that text readability, touch targets, and navigation hierarchy remained consistent across breakpoints.\n\nPerformance optimization—lazy loading of images, code splitting, and efficient MongoDB indexing—ensured that the platform remained responsive as content volume grew.\n\nSphere demonstrates that full-stack blog platforms, while conceptually straightforward, require significant attention to real-time state synchronization, role-based security, and responsive design to deliver a production-quality user experience.',
  9
);

-- ============================================
-- EDUCATION
-- ============================================
INSERT INTO public.education (degree, subject, institution, logo, year, sort_order)
VALUES
('Bachelor of Technology', 'Computer Science & Engineering', 'National Institute of Technology Rourkela', '/images/logos/nitrkl.png', '2025', 1),
('Higher Secondary Certificate', 'Science', 'Govt. Debendra College, Manikganj', '/images/logos/dhaka-board.png', '2019', 2),
('Secondary School Certificate', 'Science', 'Manikganj Govt. High School, Manikganj', '/images/logos/dhaka-board.png', '2017', 3);

-- ============================================
-- CERTIFICATIONS
-- ============================================
INSERT INTO public.certifications (name, sort_order)
VALUES
('Microsoft Certified: Fabric Analytics Engineer Associate (DP-600)', 1),
('Microsoft Certified: Fabric Data Engineer Associate (DP-700)', 2),
('Microsoft Certified: SQL AI Developer Associate (DP-800)', 3),
('Microsoft Certified: Power BI Data Analyst Associate (PL-300)', 4);

-- ============================================
-- PUBLICATIONS
-- ============================================
INSERT INTO public.publications (title, authors, affiliations, conference, location, date, doi, pages, keywords, abstract, url)
VALUES (
  'Transformer-Based Model for Building Classification Under Diverse Lighting Conditions',
  '[{"name":"S. Ghosh","affil":1},{"name":"S. K. Panda","affil":2},{"name":"M. K. Bishwal","affil":1},{"name":"P. K. Sa","affil":1}]',
  '["Department of Computer Science and Engineering, National Institute of Technology Rourkela, India","Department of Computer Science, School of Computer Science, UPES Dehradun, India"]',
  '2025 International Conference on Innovative Trends in Information Technology (ICITIIT)',
  'Kottayam, India',
  '21–22 February 2025',
  '10.1109/ICITIIT64777.2025.11040288',
  'pp. 1–6',
  '["Building Classification","Transformer","Self-Attention","Computer Vision","Image Enhancement"]',
  'Building classification is pivotal in various applications, such as urban planning, navigation, and campus management. This paper presents a novel approach for building classification using a transformer-based model. The proposed framework integrates convolutional neural networks and self-attention mechanisms, leveraging the capabilities of both local and non-local feature extraction. We have curated a diverse dataset by taking images of various buildings at the National Institute of Technology Rourkela (NITR) campus. To address challenges posed by diverse lighting conditions, we have included images of both day and night. Our dataset includes 1600 images in total, having 10 classes. Image enhancement techniques such as histogram equalization are employed to mitigate the effects of poor illumination. Experimental results demonstrate the superiority of our approach in achieving robust classification under varying lighting conditions. Additionally, a user-friendly graphical user interface (GUI) is developed, enabling building classification through image uploads.',
  'https://ieeexplore.ieee.org/abstract/document/11040288'
);

-- ============================================
-- SKILLS
-- ============================================
INSERT INTO public.skills (label, color, category, sort_order)
VALUES
-- Languages
('Python', '#3776AB', 'languages', 1),
('Java', '#ED8B00', 'languages', 2),
('C++', '#00599C', 'languages', 3),
('JavaScript', '#F7DF1E', 'languages', 4),
('TypeScript', '#3178C6', 'languages', 5),
-- Web Technologies
('HTML5', '#E34F26', 'web', 1),
('CSS', '#1572B6', 'web', 2),
('TailwindCSS', '#06B6D4', 'web', 3),
('React', '#61DAFB', 'web', 4),
('Redux', '#764ABC', 'web', 5),
('Node.js', '#339933', 'web', 6),
('Express.js', '#000000', 'web', 7),
('Next.js', '#000000', 'web', 8),
('jQuery', '#0769AD', 'web', 9),
('Gulp', '#CF4647', 'web', 10),
('Spring Boot', '#6DB33F', 'web', 11),
('Django', '#092E20', 'web', 12),
('Flask', '#000000', 'web', 13),
('Streamlit', '#FF4B4B', 'web', 14),
('FastAPI', '#009688', 'web', 15),
('Docker', '#2496ED', 'web', 16),
('Socket.io', '#010101', 'web', 17),
('Apache Kafka', '#231F20', 'web', 18),
('Redis', '#FF4438', 'web', 19),
('Kubernetes', '#326CE5', 'web', 20),
('nginx', '#009639', 'web', 21),
('YAML', '#CB171E', 'web', 22),
('Jenkins', '#D24939', 'web', 23),
('Git', '#F05032', 'web', 24),
('GitHub', '#181717', 'web', 25),
('PyTorch', '#EE4C2C', 'web', 26),
('Keras', '#D00000', 'web', 27),
('TensorFlow', '#FF6F00', 'web', 28),
('NumPy', '#013243', 'web', 29),
('Pandas', '#150458', 'web', 30),
('Dask', '#F9A03F', 'web', 31),
('Polars', '#CD7F32', 'web', 32),
('Scikit-learn', '#F7931E', 'web', 33),
('OpenCV', '#5C3EE8', 'web', 34),
('Plotly', '#3F4F75', 'web', 35),
('tqdm', '#FF6F00', 'web', 36),
('SciPy', '#8CAAE6', 'web', 37),
('MLflow', '#0194E2', 'web', 38),
('LangChain', '#1C3C3C', 'web', 39),
-- Databases
('PostgreSQL', '#4169E1', 'databases', 1),
('MySQL', '#4479A1', 'databases', 2),
('MongoDB', '#47A248', 'databases', 3),
('SQLite', '#003B57', 'databases', 4),
('Firebase', '#FFCA28', 'databases', 5);

-- ============================================
-- SOCIAL LINKS
-- ============================================
INSERT INTO public.social_links (platform, url, label, icon_svg, sort_order)
VALUES
('Email', 'mailto:shawonghosh2002@gmail.com', 'Email', '', 1),
('LinkedIn', 'https://linkedin.com/in/5upto', 'LinkedIn', '', 2),
('GitHub', 'https://github.com/5upto', 'GitHub', '', 3),
('Google Scholar', 'https://scholar.google.com/citations?user=IquMx3kAAAAJ&hl=en', 'Google Scholar', '', 4),
('Facebook', 'https://facebook.com/5upto', 'Facebook', '', 5),
('Instagram', 'https://instagram.com/5upto', 'Instagram', '', 6),
('LeetCode', 'https://leetcode.com/5upto', 'LeetCode', '', 7);

-- ============================================
-- BLOGS
-- ============================================
INSERT INTO public.blogs (title, excerpt, date, image, tags, content, slug, sort_order)
VALUES
(
  'Building Scalable APIs with Node.js',
  'A deep dive into designing RESTful APIs that handle thousands of requests without breaking a sweat.',
  'Jun 2025',
  'https://picsum.photos/seed/api/800/400',
  '["Node.js","Backend","API"]',
  '[{"type":"paragraph","text":"Designing an API that serves a handful of endpoints is straightforward. Designing one that handles thousands of concurrent requests without degrading requires deliberate architectural choices at every layer."},{"type":"paragraph","text":"The foundation is non-blocking I/O — Node.js handles concurrency through an event loop rather than thread-per-request, which means your API can serve far more clients with far less memory. But this advantage evaporates the moment you block the event loop with synchronous operations."},{"type":"image","src":"https://picsum.photos/seed/server/800/400","alt":"Server architecture","caption":"Event-driven architecture enables high concurrency"},{"type":"paragraph","text":"Database queries are the most common offender. An ORM that lazily loads related entities can trigger N+1 queries on a single request, each one holding an open connection."},{"type":"code","language":"javascript","code":"// Bad: N+1 queries\nconst users = await User.findAll();\nfor (const user of users) {\n  user.posts = await Post.findAll({ where: { userId: user.id } });\n}\n\n// Good: Eager loading\nconst users = await User.findAll({\n  include: [{ model: Post, as: ''posts'' }]\n});"},{"type":"paragraph","text":"Rate limiting is another essential layer. Without it, a single misbehaving client — or a bot — can exhaust your connection pool and take down every other client. Token bucket algorithms provide a good balance between fairness and burst tolerance."},{"type":"paragraph","text":"Response compression, structured logging, and health check endpoints are not glamorous, but they are what separate a prototype from a production service. Compression reduces bandwidth. Structured logs enable debugging at scale. Health checks let load balancers and orchestrators make informed routing decisions."},{"type":"paragraph","text":"The most important lesson: performance is not a feature you bolt on — it is a property that emerges from consistent, disciplined choices made throughout the development process."}]',
  'building-scalable-apis-with-node-js',
  1
),
(
  'Why TypeScript Changed How I Write JavaScript',
  'From skeptic to advocate — how type safety transformed my development workflow and caught bugs before they shipped.',
  'May 2025',
  'https://picsum.photos/seed/typescript/800/400',
  '["TypeScript","JavaScript"]',
  '[{"type":"paragraph","text":"I resisted TypeScript for longer than I should have. My arguments were familiar: JavaScript is flexible, types add friction, the compiler gets in the way. These arguments were wrong — or rather, they were optimizing for the wrong thing."},{"type":"paragraph","text":"The real cost of dynamic typing is not the occasional runtime error. It is the cognitive load of holding a mental model of what each variable contains, what each function expects, and what each object looks like. This load accumulates silently across a codebase until refactoring becomes an act of faith."},{"type":"code","language":"typescript","code":"// Without types: what does this return?\nfunction processData(input) {\n  // Is input a string? number? object?\n  // What does this return?\n}\n\n// With types: crystal clear\nfunction processData(input: UserInput): ProcessedResult {\n  // Both input and output are fully typed\n  // IDE autocompletion works perfectly\n}"},{"type":"paragraph","text":"TypeScript converts that mental model into explicit declarations that the compiler can verify. The first time you rename a property and watch the compiler light up every affected location, you understand the value."},{"type":"image","src":"https://picsum.photos/seed/ide/800/400","alt":"IDE with TypeScript","caption":"Type safety catches errors at compile time"},{"type":"paragraph","text":"The friction I feared is real but temporary. Types do slow you down initially — especially when working with complex generics or third-party libraries with incomplete type definitions. But the speed you lose in writing, you gain tenfold in reading, debugging, and refactoring. Code is read far more often than it is written."},{"type":"paragraph","text":"The practical approach is incremental adoption. Start with strict mode disabled, enable it progressively. Use any as an escape hatch, not a default. Let the type system evolve alongside the codebase rather than imposing it wholesale from day one."},{"type":"paragraph","text":"TypeScript did not make me a better programmer. It made the consequences of my mistakes visible sooner, which is the next best thing."}]',
  'why-typescript-changed-how-i-write-javascript',
  2
),
(
  'Deploying ML Models in Production',
  'Lessons learned from moving machine learning pipelines from Jupyter notebooks to production-grade serving infrastructure.',
  'Apr 2025',
  'https://picsum.photos/seed/ml/800/400',
  '["Machine Learning","DevOps","Python"]',
  '[{"type":"paragraph","text":"The gap between a working Jupyter notebook and a production ML system is vast, and most tutorials ignore it entirely. Getting a model to 95% accuracy on a clean dataset is the easy part. Serving that model reliably, at scale, with acceptable latency — that is where engineering begins."},{"type":"code","language":"python","code":"# Training is easy\nmodel = RandomForestClassifier(n_estimators=100)\nmodel.fit(X_train, y_train)\naccuracy = model.score(X_test, y_test)  # 0.95!\n\n# Production is harder\nimport onnxruntime as ort\nsession = ort.InferenceSession(\"model.onnx\")\npredictions = session.run(None, {\"input\": input_data})"},{"type":"paragraph","text":"The first challenge is model serialization. Pickle is convenient but insecure and version-dependent. ONNX provides a framework-agnostic format that enables inference across runtimes."},{"type":"image","src":"https://picsum.photos/seed/pipeline/800/400","alt":"ML Pipeline","caption":"From notebook to production pipeline"},{"type":"paragraph","text":"Monitoring is where most ML deployments fail silently. Model performance degrades over time as input distributions shift — a phenomenon known as data drift. Without monitoring, you discover degradation only when users complain or metrics collapse."},{"type":"paragraph","text":"The hardest lesson is that ML systems are software systems, subject to the same engineering principles as any other. Testing, versioning, monitoring, rollback capability — none of these are optional. The model is the least complex part of the system."}]',
  'deploying-ml-models-in-production',
  3
),
(
  'The Art of Clean Code',
  'Why readable code matters more than clever code, and practical habits that make your codebase a joy to work with.',
  'Mar 2025',
  NULL,
  '["Software Engineering","Best Practices"]',
  '[{"type":"paragraph","text":"Clean code is not about aesthetics. It is about reducing the cost of change — the time and effort required to understand, modify, and extend a codebase. This cost is dominated not by writing new code, but by reading existing code."},{"type":"paragraph","text":"The most impactful habit is naming. A well-named variable or function eliminates the need for comments, reduces cognitive load, and makes refactoring safer. If you find yourself writing a comment to explain what a function does, the function name is probably wrong."},{"type":"code","language":"javascript","code":"// Bad: what does this do?\nconst d = new Date() - u.ct;\n\n// Good: intent is obvious\nconst timeSinceCreation = Date.now() - user.createdAt;"},{"type":"paragraph","text":"Short functions are easier to understand, test, and reuse. But \"short\" is not an end in itself — a function that does one thing clearly is better split into two functions that each do one thing clearly than combined into one that does two things vaguely."},{"type":"paragraph","text":"The test suite is not optional. Untested code is code that cannot be safely changed. The cost of a bug caught in production dwarfs the cost of a test written during development."},{"type":"paragraph","text":"Clean code is not written — it is rewritten. The first draft of any function is a rough approximation. Refactoring is the process of turning that approximation into something precise, readable, and robust. Budget time for it, or pay for it later."}]',
  'the-art-of-clean-code',
  4
),
(
  'Getting Started with React Server Components',
  'Understanding the new mental model behind RSC and how it changes the way we think about rendering in React.',
  'Feb 2025',
  'https://picsum.photos/seed/react/800/400',
  '["React","Frontend","Next.js"]',
  '[{"type":"paragraph","text":"React Server Components represent the most significant shift in React''s mental model since hooks. The core idea: some components run only on the server, producing serialized output that is sent to the client as part of the initial HTML. They never ship JavaScript to the browser."},{"type":"code","language":"jsx","code":"// This component runs ONLY on the server\nasync function BlogPost({ id }) {\n  const post = await db.posts.findById(id); // direct DB access!\n  return (\n    <article>\n      <h1>{post.title}</h1>\n      <p>{post.content}</p>\n    </article>\n  );\n}\n\n// This component runs on the client\n''use client'';\nfunction LikeButton({ postId }) {\n  const [liked, setLiked] = useState(false);\n  return <button onClick={() => setLiked(!liked)}>\n    {liked ? ''❤️'' : ''🤍''}\n  </button>\n}"},{"type":"paragraph","text":"This is not server-side rendering in the traditional sense. SSR executes components on the server but hydrates them on the client — the JavaScript is still sent. RSC eliminates the JavaScript entirely for server components. The client only receives the rendered output, not the component code."},{"type":"image","src":"https://picsum.photos/seed/architecture/800/400","alt":"RSC Architecture","caption":"Server and client component boundaries"},{"type":"paragraph","text":"The practical benefit is reduced bundle size. Components that fetch data, access databases, or perform heavy computation can run on the server without adding to the client JavaScript payload."},{"type":"paragraph","text":"The migration path for existing applications is gradual. New features can use RSC from the start. Existing pages can be migrated incrementally, moving data fetching to server components while keeping interactive elements as client components."}]',
  'getting-started-with-react-server-components',
  5
);

-- ============================================
-- GALLERY STORIES
-- ============================================
INSERT INTO public.gallery_stories (title, image, period, slug, story, tags, sort_order)
VALUES
(
  'Mountain Escape',
  'https://picsum.photos/seed/mountain/1200/800',
  'Summer 2024',
  'mountain-escape',
  E'There''s something about standing at the edge of a mountain trail that makes the world feel both vast and intimate. The air is thinner up here, sharper, carrying the scent of pine and wet stone. Every breath feels deliberate, every step a small act of trust between you and the earth beneath your boots.\n\nThe trail wound upward through a corridor of ancient conifers, their trunks scarred by decades of wind and ice. Sunlight filtered through the canopy in shifting patterns, painting the forest floor in gold and shadow. Somewhere ahead, a creek murmured over smooth rocks — a sound so constant it became silence.\n\nAt the summit, the valley unfolded like a map drawn by hand. Rivers carved silver lines through patches of emerald and amber. The horizon was a soft blur where sky met distant peaks, each one a slightly different shade of blue. I sat on a flat stone, removed my pack, and simply existed in that space for a while.\n\nNo signal. No notifications. Just the sound of wind moving through grass and the quiet satisfaction of having climbed. These are the moments that recalibrate something inside you — a reminder that the world is far larger than the screens we stare at, and far more beautiful than we often allow ourselves to notice.',
  '["Nature","Travel","Photography"]',
  1
),
(
  'Urban Nights',
  'https://picsum.photos/seed/urban/1200/800',
  'Winter 2024',
  'urban-nights',
  E'The city transforms after dark. Neon signs flicker to life, casting red and blue reflections across wet pavement. Taxis blur past in streaks of yellow. The sidewalks fill with people — couples holding hands, friends laughing over loud music spilling from open doorways, solo walkers with earbuds in, lost in their own soundtracks.\n\nI walked without a destination, letting the grid of streets guide me. A jazz club on the corner spilled warm saxophone notes into the cold air. A ramen shop glowed from behind fogged windows, steam rising from bowls carried by servers who moved with practiced efficiency. Street performers set up near the bridge — a guitarist tuning strings, a dancer stretching in the amber light of a streetlamp.\n\nThere''s a rhythm to city nights that daytime doesn''t have. The urgency fades. People linger longer, talk louder, laugh more freely. Strangers make eye contact and nod. The anonymity of the crowd becomes a kind of permission — to wander, to observe, to be present without purpose.\n\nI ended up at a rooftop bar I''d never been to before, looking down at the intersection below. Cars moved in patterns, pedestrians crossed in waves, and the whole scene felt like a living organism, breathing and shifting with each passing hour. The city doesn''t sleep. It just changes shifts.',
  '["City","Nightlife","Street"]',
  2
),
(
  'Ocean Breeze',
  'https://picsum.photos/seed/ocean/1200/800',
  'Spring 2024',
  'ocean-breeze',
  E'The ocean has a way of making you feel small in the best possible way. Standing at the shoreline, waves curling and collapsing at your feet, the horizon stretches so far it curves. The sound is constant — a rhythmic roar that drowns out thought and replaces it with something simpler.\n\nI arrived at dawn, when the beach was still empty. The sand was cool and firm, packed tight by the overnight tide. Footprints from yesterday''s visitors had been erased, the shore reset to a blank canvas. Seagulls patrolled the waterline, dipping and rising with the wind.\n\nThe water was cold at first — the kind of cold that makes you gasp and then immediately adjust. I waded in up to my waist, letting the current push me gently side to side. Floating on my back, I watched the sky shift from deep indigo to pale gold as the sun cleared the horizon. Clouds caught fire for a few minutes, then softened into white.\n\nLater, I sat on a driftwood log and watched a family build a sandcastle. The kids worked with serious concentration, directing their father to fetch water in a bucket. The castle grew — towers, a moat, a flag made from a stick and a leaf. When a wave finally breached the moat, the kids cheered instead of crying. The destruction was part of the fun.\n\nThat''s the lesson the ocean teaches, over and over: nothing is permanent, and that''s exactly what makes it beautiful.',
  '["Sea","Calm","Nature"]',
  3
),
(
  'Forest Trail',
  'https://picsum.photos/seed/forest/1200/800',
  'Autumn 2024',
  'forest-trail',
  E'The trailhead was marked by a wooden post, its paint long faded, the arrow pointing into a tunnel of green. I stepped off the paved path and into the forest, and the temperature dropped five degrees. The canopy overhead was so thick it turned midday into dusk.\n\nMoss covered everything — rocks, fallen logs, the roots of trees that had been standing for centuries. Ferns unfurled from the undergrowth in perfect spirals. A woodpecker hammered somewhere out of sight, its rhythm steady and mechanical. Between the trees, shafts of light cut through the mist like spotlights on an empty stage.\n\nThe path was soft with years of decomposed leaves, each step quiet and cushioned. I passed a stream so clear I could count the pebbles on its bed. A frog sat on a rock, perfectly still, watching me with an expression that seemed both ancient and indifferent. I moved on.\n\nDeeper in, the forest grew older. The trees were wider, their bark deeply furrowed. One had fallen across the trail, its root ball exposed like a wall of earth and stone. I climbed over it, running my hand along the moss that carpeted its trunk. Fungi grew in shelves along its side — pale, almost luminous in the dim light.\n\nI emerged hours later at an overlook I hadn''t expected. The valley below was a patchwork of green, divided by a river that caught the sunlight and threw it back in flashes. I sat on the edge, legs dangling, and ate an apple I''d packed. It was the best apple I''d ever tasted. Sometimes context is everything.',
  '["Woods","Hiking","Peace"]',
  4
),
(
  'Desert Dunes',
  'https://picsum.photos/seed/desert/1200/800',
  'Late Summer 2024',
  'desert-dunes',
  E'The desert is not empty. That''s the first thing you learn. It''s full of life — just life that has learned to wait, to conserve, to bloom only when the conditions are exactly right.\n\nI arrived at the dunes in the late afternoon, when the sun was low enough to paint the sand in shades of amber and rose. The wind had sculpted the surface into ripples, each one a miniature landscape of peaks and valleys. My footsteps were the only disruption in a pattern that stretched to the horizon.\n\nWalking on sand is exhausting. Each step sinks, slides, demands more effort than flat ground. I learned to follow the ridgelines where the sand was compacted, moving along the spine of each dune like a tightrope walker. From up high, the desert revealed its hidden geography — dry riverbeds, clusters of scrub brush, the dark shapes of rocks peeking through the sand.\n\nAt sunset, the colors deepened. The sky turned from gold to burnt orange to a purple so dark it was almost black. Stars appeared one by one, then in clusters, then in such numbers that the sky felt heavy with them. I lay on the sand, which still held the day''s warmth, and looked up.\n\nThe Milky Way was visible — a smear of light across the darkness, thicker and brighter than I''d ever seen it. A shooting star crossed the sky in a silent arc. I made a wish, then laughed at myself for doing it. But the desert has that effect. It strips away cynicism and replaces it with wonder. You feel small, and you''re grateful for it.',
  '["Arid","Stars","Adventure"]',
  5
);

-- ============================================
-- NAV ITEMS
-- ============================================
INSERT INTO public.nav_items (label, href, sort_order)
VALUES
('Home', '#hero', 1),
('About', '#about', 2),
('Skills', '#skills', 3),
('Experience', '#experience', 4),
('Projects', '#projects', 5),
('Gallery', '/gallery', 6),
('Blog', '/blog', 7),
('Contact', '#contact', 8);

-- ============================================
-- LEGACY LOGOS
-- ============================================
INSERT INTO public.legacy_logos (file, number, aspect, sort_order)
VALUES
('w26.jpeg', '26', '513/531', 1),
('w22.jpeg', '22', '222/230', 2),
('21.jpeg', '21', '229/237', 3),
('19.jpeg', '19', '235/235', 4),
('w18.jpeg', '18', '240/240', 5);

-- ============================================
-- SITE CONFIG
-- ============================================
INSERT INTO public.site_config (key, value)
VALUES
('theme', '{"colors":{"primary":"#6366f1","accent":"#ec4899"}}'),
('particle_config', '{"particles":160,"speed":1.5,"line_distance":120}'),
('profile_card', '{"glow_color":"#818cf8","gradient":"linear-gradient(145deg, rgba(99,102,241,0.3), rgba(129,140,248,0.15))"}'),
('scroll_stack', '{"item_distance":120,"item_scale":0.03,"item_stack_distance":25,"stack_position":"15%","base_scale":0.88}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
