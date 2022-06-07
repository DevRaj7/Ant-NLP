FROM ubuntu:22.04

RUN apt-get update
RUN apt-get install -y software-properties-common
RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt-get update
RUN apt-get install -y python3.10

RUN apt-get install -y mysql-server
RUN systemctl start mysql.service

RUN ln -s /usr/bin/python3 /usr/bin/python
RUN apt-get install -y python3-pip

RUN apt-get install -y npm

RUN adduser hostuser
USER hostuser

WORKDIR /home/hostuser
COPY . /home/hostuser

ENV PATH="/home/hostuser/.local/bin:${PATH}"

RUN pip install --upgrade pip
RUN pip --no-cache install -r requirements.txt

USER root
RUN npm install
USER hostuser

RUN npm run build

#  default-libmysqlclient-dev build-essential
# RUN pip install mysqlclient

EXPOSE 5000

CMD ["python3", "-m" , "flask", "run", "--host=0.0.0.0"]
