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
 * Manually define the color for each technology.
 */
const technologies = [
  {
    label: "JavaScript",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    color: "#F7DF1E", // Yellow (JavaScript logo color)
  },
  {
    label: "Python",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    color: "#306998", // Greenish (Python logo color)
  },
  {
    label: "React",
    category: "Frontend Framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    color: "#61DAFB", // Cyan/Blue (React logo color)
  },
  {
    label: "Node.js",
    category: "Backend Framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    color: "#68A063", // Green (Node.js logo color)
  },
  {
    label: "MongoDB",
    category: "Database",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    color: "#47A248", // Green (MongoDB logo color)
  },
  {
    label: "PostgreSQL",
    category: "Database",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    color: "#336791", // Blue (PostgreSQL logo color)
  },
  {
    label: "Docker",
    category: "DevOps Tool",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    color: "#2496ED", // Blue (Docker logo color)
  },
  {
    label: "HTML5",
    category: "Frontend Technology",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    color: "#E34F26", // Red (HTML5 logo color)
  },
  {
    label: "CSS3",
    category: "Frontend Technology",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    color: "#1572B6", // Blue (CSS3 logo color)
  },
  {
    label: "TypeScript",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    color: "#3178C6", // Blue (TypeScript logo color)
  },
  {
    label: "Angular",
    category: "Frontend Framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
    color: "#DD1B16", // Red (Angular logo color)
  },
  {
    label: "Vue.js",
    category: "Frontend Framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
    color: "#42B883", // Green (Vue.js logo color)
  },
  {
    label: "Java",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    color: "#007396", // Blue (Java logo color)
  },
  {
    label: "C#",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
    color: "#68217A", // Purple (C# logo color)
  },
  {
    label: "PHP",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    color: "#8C6B8B", // Purple (PHP logo color)
  },
  {
    label: "Kubernetes",
    category: "DevOps Tool",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
    color: "#326CE5", // Blue (Kubernetes logo color)
  },
  {
    label: "MySQL",
    category: "Database",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    color: "#4479A1", // Blue (MySQL logo color)
  },
  {
    label: "Go",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
    color: "#00ADD8", // Cyan (Go logo color)
  },
  {
    label: "Swift",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
    color: "#F05138", // Red (Swift logo color)
  },
  {
    label: "Ruby",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg",
    color: "#D91426", // Red (Ruby logo color)
  },
  {
    label: "Git",
    category: "Version Control Tool",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    color: "#F1502F", // Red (Git logo color)
  },
  {
    label: "Linux",
    category: "Operating System",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
    color: "#FCC624", // Yellow (Linux logo color)
  },
  {
    label: "AWS",
    category: "Cloud Service",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    color: "#FF9900", // Orange (AWS logo color)
  },
  {
    label: "Azure",
    category: "Cloud Service",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
    color: "#0089D6", // Blue (Azure logo color)
  },
  {
    label: "C++",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    color: "#00599C", // Blue (C++ logo color)
  },
  {
    label: "Rust",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg",
    color: "#000000", // Black (Rust logo color)
  },
  {
    label: "Scala",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg",
    color: "#DC322F", // Red (Scala logo color)
  },
  {
    label: "Kotlin",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
    color: "#7F52FF", // Purple (Kotlin logo color)
  },
  {
    label: "Elixir",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elixir/elixir-original.svg",
    color: "#6E4A7E", // Purple (Elixir logo color)
  },
  {
    label: "Dart",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
    color: "#00B4AB", // Teal (Dart logo color)
  },
  {
    label: "GraphQL",
    category: "Query Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
    color: "#E10098", // Pink (GraphQL logo color)
  },
  {
    label: "Terraform",
    category: "Infrastructure as Code",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg",
    color: "#7B42BC", // Purple (Terraform logo color)
  },
  {
    label: "Ansible",
    category: "CI/CD Tool",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg",
    color: "#2A2A2A", // Dark Gray (Ansible logo color)
  },
  {
    label: "Jenkins",
    category: "CI/CD Tool",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg",
    color: "#D24939", // Red (Jenkins logo color)
  },
  {
    label: "CircleCI",
    category: "CI/CD Tool",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/circleci/circleci-plain.svg",
    color: "#343434", // Dark Gray (CircleCI logo color)
  },
  {
    label: "Travis CI",
    category: "CI/CD Tool",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/travis/travis-original.svg",
    color: "#3EAAAF", // Teal (Travis CI logo color)
  },
  {
    label: "GitLab CI",
    category: "CI/CD Tool",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg",
    color: "#FCA121", // Orange (GitLab CI logo color)
  },
  {
    label: "AWS Lambda",
    category: "Cloud Service",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    color: "#FF9900", // Orange (AWS Lambda logo color)
  },
  {
    label: "Google Cloud",
    category: "Cloud Service",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
    color: "#4285F4", // Blue (Google Cloud logo color)
  },
  {
    label: "Azure DevOps",
    category: "Cloud Service",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
    color: "#0089D6", // Blue (Azure DevOps logo color)
  },
  {
    label: "Cloudflare",
    category: "Cloud Service",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cloudflare/cloudflare-original.svg",
    color: "#F38020", // Orange (Cloudflare logo color)
  },
  {
    label: "TensorFlow",
    category: "AI Framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
    color: "#FF6F00", // Orange (TensorFlow logo color)
  },
  {
    label: "PyTorch",
    category: "AI Framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
    color: "#EE4C2C", // Red (PyTorch logo color)
  },
  {
    label: "Keras",
    category: "AI Framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/keras/keras-original.svg",
    color: "#D00000", // Red (Keras logo color)
  },
  {
    label: "OpenAI",
    category: "AI Framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openai/openai-original.svg",
    color: "#6E0A35", // Red (OpenAI logo color)
  },
  {
    label: "Hadoop",
    category: "Big Data",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/hadoop/hadoop-original.svg",
    color: "#66CC66", // Green (Hadoop logo color)
  },
  {
    label: "Spark",
    category: "Big Data",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg",
    color: "#E25A1C", // Orange (Apache Spark logo color)
  },
  {
    label: "Cassandra",
    category: "Database",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cassandra/cassandra-original.svg",
    color: "#1287B1", // Blue (Cassandra logo color)
  },
  {
    label: "Redis",
    category: "Database",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
    color: "#D92D2B", // Red (Redis logo color)
  },
  {
    label: "SQLite",
    category: "Database",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
    color: "#003B57", // Blue (SQLite logo color)
  },
  {
    label: "Elasticsearch",
    category: "Search Engine",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elasticsearch/elasticsearch-original.svg",
    color: "#005571", // Blue (Elasticsearch logo color)
  },
  {
    label: "RedisGraph",
    category: "Database",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
    color: "#D92D2B", // Red (RedisGraph logo color)
  },
  {
    label: "Apache Kafka",
    category: "Message Broker",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg",
    color: "#231F20", // Dark (Kafka logo color)
  },
  {
    label: "RabbitMQ",
    category: "Message Broker",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rabbitmq/rabbitmq-original.svg",
    color: "#FF6600", // Orange (RabbitMQ logo color)
  },
  {
    label: "MongoDB Atlas",
    category: "Database",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    color: "#47A248", // Green (MongoDB Atlas logo color)
  },
  {
    label: "MariaDB",
    category: "Database",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mariadb/mariadb-original.svg",
    color: "#003B57", // Blue (MariaDB logo color)
  },

  {
    label: "Figma",
    category: "Design Tool",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
    color: "#F24E1E", // Orange (Figma logo color)
  },
  {
    label: "Gatsby",
    category: "Static Site Generator",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gatsby/gatsby-original.svg",
    color: "#663399", // Purple (Gatsby logo color)
  },
  {
    label: "Next.js",
    category: "Framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    color: "#000000", // Black (Next.js logo color)
  },
  {
    label: "Jupyter",
    category: "Data Science Tool",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg",
    color: "#F37626", // Orange (Jupyter logo color)
  },
  {
    label: "R",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg",
    color: "#276DC3", // Blue (R logo color)
  },
  {
    label: "Matlab",
    category: "Data Science Tool",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg",
    color: "#0076A8", // Blue (Matlab logo color)
  },
  {
    label: "BigQuery",
    category: "Database",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
    color: "#4285F4", // Blue (BigQuery logo color)
  },
  {
    label: "Snowflake",
    category: "Cloud Database",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/snowflake/snowflake-original.svg",
    color: "#00A9E0", // Blue (Snowflake logo color)
  },
  {
    label: "AWS S3",
    category: "Cloud Service",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    color: "#FF9900", // Orange (AWS S3 logo color)
  },
  {
    label: "Docker Compose",
    category: "DevOps Tool",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    color: "#2496ED", // Blue (Docker Compose logo color)
  },
  {
    label: "Go",
    category: "Programming Language",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
    color: "#00ADD8", // Cyan (Go logo color)
  },
  {
    label: "Vagrant",
    category: "DevOps Tool",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vagrant/vagrant-original.svg",
    color: "#FDC732", // Yellow (Vagrant logo color)
  },
  {
    label: "Vagrant",
    category: "DevOps Tool",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vagrant/vagrant-original.svg",
    color: "#FDC732", // Yellow (Vagrant logo color)
  },
  {
    label: "DigitalOcean",
    category: "Cloud Service",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/digitalocean/digitalocean-original.svg",
    color: "#0080FF", // Blue (DigitalOcean logo color)
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
