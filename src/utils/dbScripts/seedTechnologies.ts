// Use this command in the terminal to update the TechnologiesInventory collection: 
// npx ts-node ./src/utils/dbScripts/seedTechnologies.ts

import mongoose from "mongoose";
import TechnologiesInventory from "../../models/TechnologiesInventory";
import dotenv from "dotenv";
dotenv.config();

const removeDuplicatesByProperty = <T, K extends keyof T>(
  array: T[],
  property: K
): T[] => {
  const seenValues = new Set<T[K]>();
  return array.filter(item => {
    const value = item[property];
    if (seenValues.has(value)) {
      return false;
    }
    seenValues.add(value);
    return true;
  });
};

/**
 * Manually define the color and description for each technology.
 */
const technologies = [
  {
    label: "JavaScript",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    color: "#F7DF1E",
    description: "A versatile, high-level, interpreted programming language primarily used for front-end web development and increasingly for server-side scripting."
  },
  {
    label: "Python",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    color: "#306998",
    description: "A widely-used, high-level, interpreted programming language known for its readability and extensive use in web development, data analysis, AI, and automation."
  },
  {
    label: "React",
    category: "Frontend Framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    color: "#61DAFB",
    description: "A JavaScript library for building user interfaces, developed by Facebook. It facilitates the creation of interactive and dynamic single-page applications."
  },
  {
    label: "Node.js",
    category: "Backend Framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    color: "#68A063",
    description: "An open-source, cross-platform JavaScript runtime environment that executes JavaScript code server-side, enabling back-end development with JavaScript."
  },
  {
    label: "MongoDB",
    category: "Database",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    color: "#47A248",
    description: "A document-oriented NoSQL database used for scalable, high-performance applications, characterized by its flexible schema and ease of use."
  },
  {
    label: "PostgreSQL",
    category: "Database",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    color: "#336791",
    description: "A powerful, open-source relational database system known for its reliability, extensibility, and SQL compliance."
  },
  {
    label: "Docker",
    category: "DevOps Tool",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    color: "#2496ED",
    description: "A platform that uses containerization to deliver software in packages called containers, enabling consistent and efficient software deployment across different environments."
  },
  {
    label: "HTML5",
    category: "Frontend Technology",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    color: "#E34F26",
     description: "The latest evolution of the standard markup language for creating web pages, providing the structure and content of web documents."
  },
  {
    label: "CSS3",
    category: "Frontend Technology",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    color: "#1572B6",
    description: "The latest evolution of the style sheet language used to describe the look and formatting of a document written in markup language like HTML."
  },
    {
    label: "TypeScript",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    color: "#3178C6",
      description: "A superset of JavaScript that adds static typing, making large-scale applications more maintainable and less error-prone."
  },
  {
    label: "Angular",
    category: "Frontend Framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
    color: "#DD1B16",
    description: "A comprehensive, open-source front-end development platform led by Google, used for building complex single-page web applications."
  },
  {
    label: "Vue.js",
    category: "Frontend Framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
    color: "#42B883",
    description: "A progressive, lightweight, and easy-to-use JavaScript framework for building user interfaces and single-page applications."
  },
  {
    label: "Java",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    color: "#007396",
     description: "A widely used, class-based, object-oriented programming language known for its platform independence and use in enterprise applications."
  },
    {
    label: "C#",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
    color: "#68217A",
    description: "A multi-paradigm, object-oriented programming language developed by Microsoft, widely used for developing Windows applications and video games."
  },
  {
    label: "PHP",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    color: "#8C6B8B",
    description: "A widely-used open-source, server-side scripting language mainly used for web development and embedding within HTML."
  },
    {
    label: "Kubernetes",
    category: "DevOps Tool",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
    color: "#326CE5",
    description: "An open-source platform for automating deployment, scaling, and management of containerized applications."
  },
  {
    label: "MySQL",
    category: "Database",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    color: "#4479A1",
    description:"A popular open-source relational database management system known for its reliability and widespread use in web applications."
  },
    {
    label: "Go",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
    color: "#00ADD8",
    description:"A statically typed, compiled programming language designed at Google, known for its simplicity, efficiency, and suitability for concurrent programming."
  },
  {
    label: "Swift",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
    color: "#F05138",
    description: "A powerful and intuitive programming language developed by Apple for creating apps across all Apple platforms."
  },
  {
    label: "Ruby",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg",
    color: "#D91426",
    description: "A dynamic, open-source programming language focused on simplicity and productivity, often used for web development with frameworks like Ruby on Rails."
  },
  {
    label: "Git",
    category: "Version Control Tool",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    color: "#F1502F",
    description: "A distributed version control system for tracking changes in source code during software development, enabling collaboration among developers."
  },
  {
    label: "Linux",
    category: "Operating System",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
    color: "#FCC624",
    description: "An open-source operating system kernel that forms the foundation of many Linux distributions, known for its stability, flexibility, and server applications."
  },
  {
    label: "AWS",
    category: "Cloud Service",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    color: "#FF9900",
    description: "A comprehensive cloud computing platform offered by Amazon, providing a variety of on-demand services, including compute, storage, and databases."
  },
  {
    label: "Azure",
    category: "Cloud Service",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
    color: "#0089D6",
    description: "A cloud computing platform offered by Microsoft, providing a range of services for building, deploying, and managing applications and services."
  },
  {
    label: "C++",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    color: "#00599C",
    description: "A general-purpose, object-oriented programming language known for its high performance and use in system programming, game development, and other demanding applications."
  },
   {
    label: "Rust",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg",
    color: "#000000",
    description: "A multi-paradigm, general-purpose programming language focused on safety and performance, suitable for systems programming, web development, and more."
  },
    {
    label: "Scala",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg",
    color: "#DC322F",
    description:"A general-purpose programming language that combines object-oriented and functional programming paradigms, running on the Java Virtual Machine."
  },
    {
    label: "Kotlin",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
    color: "#7F52FF",
      description: "A modern, concise, and interoperable programming language that runs on the Java Virtual Machine (JVM), often used for Android development and server-side applications."
  },
  {
    label: "Elixir",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elixir/elixir-original.svg",
    color: "#6E4A7E",
    description: "A dynamic, functional programming language built on the Erlang VM, designed for building scalable and fault-tolerant applications."
  },
  {
    label: "Dart",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
    color: "#00B4AB",
    description: "A client-optimized language developed by Google, used for creating fast apps for any platform, especially used in conjunction with the Flutter framework."
  },
  {
      label: "GraphQL",
      category: "Query Language",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
      color: "#E10098",
      description: "A query language for APIs and a runtime for fulfilling those queries with your existing data. It provides a more efficient alternative to REST APIs."
    },
    {
    label: "Terraform",
    category: "Infrastructure as Code",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg",
    color: "#7B42BC",
      description: "An open-source infrastructure as code software tool that allows users to define and provision data center infrastructure using a declarative configuration language."
  },
  {
    label: "Ansible",
    category: "CI/CD Tool",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg",
    color: "#2A2A2A",
      description: "An open-source software provisioning, configuration management, and application-deployment tool, enabling automation across diverse environments."
  },
  {
    label: "Jenkins",
    category: "CI/CD Tool",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg",
    color: "#D24939",
     description:"An open-source automation server that supports building, deploying, and automating software projects through continuous integration and continuous delivery."
  },
    {
    label: "CircleCI",
    category: "CI/CD Tool",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/circleci/circleci-plain.svg",
    color: "#343434",
    description: "A continuous integration and continuous delivery platform for automating software builds, tests, and deployments."
  },
    {
    label: "Travis CI",
    category: "CI/CD Tool",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/travis/travis-original.svg",
    color: "#3EAAAF",
      description: "A continuous integration service for building and testing software projects, often integrated with GitHub for automated builds and deployments."
  },
    {
      label: "GitLab CI",
      category: "CI/CD Tool",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg",
      color: "#FCA121",
      description: "A continuous integration and delivery service integrated within the GitLab platform, allowing for automated software pipelines and deployments."
    },
    {
    label: "AWS Lambda",
    category: "Cloud Service",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    color: "#FF9900",
    description: "A serverless compute service that lets you run code without provisioning or managing servers, enabling event-driven applications and functions."
  },
  {
    label: "Google Cloud",
    category: "Cloud Service",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
    color: "#4285F4",
    description: "A suite of cloud computing services offered by Google, including compute, storage, databases, and machine learning tools."
  },
  {
    label: "Azure DevOps",
    category: "Cloud Service",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
    color: "#0089D6",
    description:"A collection of development services, including version control, CI/CD, and project management, provided by Microsoft Azure for teams to develop and deploy software."
  },
  {
    label: "Cloudflare",
    category: "Cloud Service",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cloudflare/cloudflare-original.svg",
    color: "#F38020",
    description: "A web infrastructure and security company, providing services like content delivery, DDoS protection, and domain name registration."
  },
    {
    label: "TensorFlow",
    category: "AI Framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
    color: "#FF6F00",
     description: "An open-source library for machine learning developed by Google, enabling the creation and training of neural networks for various AI applications."
  },
    {
    label: "PyTorch",
    category: "AI Framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
    color: "#EE4C2C",
      description: "An open-source machine learning framework developed by Facebook, known for its flexibility and ease of use, suitable for research and production deployment."
  },
  {
    label: "Keras",
    category: "AI Framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/keras/keras-original.svg",
    color: "#D00000",
    description:"A high-level neural networks API, capable of running on top of TensorFlow, Theano, or Microsoft Cognitive Toolkit, offering ease of use and flexibility."
  },
    {
    label: "OpenAI",
    category: "AI Framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openai/openai-original.svg",
    color: "#6E0A35",
    description: "An AI research and deployment company known for cutting-edge AI models, including large language models and AI tools."
    },
    {
        label: "Hadoop",
        category: "Big Data",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/hadoop/hadoop-original.svg",
        color: "#66CC66",
      description:"An open-source framework for distributed storage and processing of large datasets across clusters of computers using simple programming models."
    },
    {
    label: "Spark",
    category: "Big Data",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg",
    color: "#E25A1C",
    description: "An open-source, distributed computing system for big data processing, offering high-performance in-memory data processing for analytics and machine learning."
  },
  {
    label: "Cassandra",
    category: "Database",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cassandra/cassandra-original.svg",
    color: "#1287B1",
     description:"A highly scalable, distributed NoSQL database designed to handle large amounts of data across multiple servers."
  },
   {
    label: "Redis",
    category: "Database",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
    color: "#D92D2B",
    description: "An in-memory data structure store, used as a database, cache, and message broker. Known for high performance and flexibility."
  },
    {
    label: "SQLite",
    category: "Database",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
    color: "#003B57",
     description: "A self-contained, serverless, SQL database engine, widely used for embedded systems and small-scale applications."
  },
  {
    label: "Elasticsearch",
    category: "Search Engine",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elasticsearch/elasticsearch-original.svg",
    color: "#005571",
    description: "A distributed, RESTful search and analytics engine, often used for full-text search, log analysis, and data visualization."
  },
    {
        label: "RedisGraph",
        category: "Database",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
        color: "#D92D2B",
        description: "A graph database module for Redis, enabling the representation and manipulation of relationships between data entities."
    },
    {
        label: "Apache Kafka",
        category: "Message Broker",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg",
        color: "#231F20",
      description: "A distributed event streaming platform used to build real-time data pipelines and streaming applications, known for its high throughput and scalability."
    },
    {
        label: "RabbitMQ",
        category: "Message Broker",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rabbitmq/rabbitmq-original.svg",
        color: "#FF6600",
        description:"An open-source message broker that implements the AMQP protocol, facilitating asynchronous communication between applications."
    },
    {
      label: "MongoDB Atlas",
      category: "Database",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
      color: "#47A248",
      description: "A fully-managed cloud database service for MongoDB, providing a scalable, flexible, and secure database solution."
    },
  {
    label: "MariaDB",
    category: "Database",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mariadb/mariadb-original.svg",
    color: "#003B57",
    description: "A community-developed, open-source relational database, compatible with MySQL, known for its performance and stability."
  },
    {
      label: "Figma",
      category: "Design Tool",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
      color: "#F24E1E",
      description: "A collaborative web application for interface design, enabling real-time collaboration and prototyping among design teams."
    },
    {
      label: "Gatsby",
      category: "Static Site Generator",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gatsby/gatsby-original.svg",
      color: "#663399",
      description: "A React-based, open-source static site generator for building blazing-fast websites and apps. It combines the ease of a CMS with the scalability of static sites."
    },
  {
    label: "Next.js",
    category: "Framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    color: "#000000",
    description:"A React framework for building server-rendered and statically generated websites and web applications. Offers features like code splitting, routing, and API routes."
  },
  {
    label: "Jupyter",
    category: "Data Science Tool",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg",
    color: "#F37626",
      description: "An interactive web-based notebook environment used for data analysis, scientific computing, and interactive storytelling with code, visualizations, and text."
  },
  {
    label: "R",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg",
    color: "#276DC3",
    description: "A programming language and free software environment for statistical computing and graphics, popular in academia and research."
    },
    {
      label: "Matlab",
      category: "Data Science Tool",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg",
      color: "#0076A8",
      description: "A proprietary multi-paradigm programming language and numeric computing environment, widely used in engineering, science, and research."
    },
  {
      label: "BigQuery",
      category: "Database",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
      color: "#4285F4",
      description: "A fully-managed, serverless data warehouse service by Google Cloud, enabling large-scale data analysis with SQL queries."
    },
    {
      label: "Snowflake",
      category: "Cloud Database",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/snowflake/snowflake-original.svg",
      color: "#00A9E0",
      description: "A cloud data platform offering data warehousing, data lakes, and data engineering capabilities, known for its scalable and performant data management."
    },
   {
        label: "AWS S3",
        category: "Cloud Service",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
        color: "#FF9900",
        description: "A scalable and secure object storage service by AWS, suitable for storing and retrieving any amount of data at any time."
    },
    {
        label: "Docker Compose",
        category: "DevOps Tool",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
        color: "#2496ED",
        description: "A tool for defining and running multi-container Docker applications, enabling users to set up and manage complex app environments."
    },
    {
      label: "Go",
      category: "Programming Language",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
       color: "#00ADD8",
      description: "A statically typed, compiled programming language designed at Google, known for its simplicity, efficiency, and suitability for concurrent programming."
   },
    {
      label: "Vagrant",
      category: "DevOps Tool",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vagrant/vagrant-original.svg",
      color: "#FDC732",
      description: "A tool for creating and managing virtual development environments, allowing developers to have consistent and reproducible setups."
    },
     {
      label: "DigitalOcean",
      category: "Cloud Service",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/digitalocean/digitalocean-original.svg",
      color: "#0080FF",
      description: "A cloud infrastructure provider offering cloud servers, databases, and other services for deploying and managing applications."
    },

];

const seedTechnologies = async () => {
  const filteredTechnologies = removeDuplicatesByProperty(technologies, "label");
  const diff = technologies.length - filteredTechnologies.length;
  console.log(`You had ${diff} duplicate${diff>1?'s':''}... Inventory size is now ${filteredTechnologies.length}`)

  try {
    if (!process.env.DB_CONNECTION) {
      console.log("No connection string! exiting...");
      process.exit();
    }
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log("Connected to DB successfully");

    // Clear the collection before inserting new data
    await TechnologiesInventory.deleteMany({});
    console.log("Deleted all documents in TechnologiesInventory collection successfully");

    // Drop all indexes before inserting data
    await TechnologiesInventory.collection.dropIndexes();
    console.log("Dropped indexes successfully");

    await TechnologiesInventory.insertMany(filteredTechnologies);
    console.log("Technologies seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("Error seeding technologies:", err);
    process.exit(1);
  }
};

seedTechnologies();