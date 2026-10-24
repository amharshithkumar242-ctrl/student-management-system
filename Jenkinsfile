pipeline {

    agent any

    stages {

        stage('Checkout') {

            steps {

                echo 'Checking out source code'

                checkout scm

            }
        }

        stage('Install Dependencies') {

            steps {

                sh 'npm install'

            }
        }

        stage('Build Docker Image') {

            steps {

                sh 'docker build -t sms-app .'

            }
        }

        stage('Verify Docker Image') {

            steps {

                sh 'docker images'

            }
        }

    }

}
