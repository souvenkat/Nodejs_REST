# Containerization

The REST API is built using Node.js and Express to fetch and process population data from the Statec website: `https://lustat.statec.lu/vis?fs[0]=Topics%2C1%7CPopulation%20and%20employment%23B%23%7CPopulation%20structure%23B1%23&pg=0&fc=Topics&lc=en&df[ds]=ds-release&df[id]=DF_B1100&df[ag]=LU1&df[vs]=1.0&pd=%2C1821&dq=C08%2BC07%2BC06%2BC05%2BC04%2BC01.A&vw=tb&lo=1`. 

The following instructions explain how to build and run the application using Docker.



## Prerequisites

* Make sure to have Docker installed on your system. Docker can be installed from the official Docker website `https://www.docker.com/`



## How to Build and Run the Application


### Step 1: Build the Docker Image

* Run the following command in the application's root directory to build the Docker image:

`docker build -t cloud .`


### Step 2: Run the Docker Container

* Start the application by running the Docker container:

`docker run -p 4000:4000 --name cloud cloud`

* This will map port 4000 of the container to port 4000 on your localhost.


### Step 3: Access the Application

* You can now access the REST API at the following URL: `http://localhost:4000/api/<year>`

* Replace <year> with the desired year parameter. For instance: `http://localhost:4000/api/2020`


### Step 4: Stop the Application

* To stop the application, find the container's ID using:

`docker ps`

* Then stop the container using:

`docker stop <container-id>`