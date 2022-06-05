FROM alpine:latest

RUN apk add --no-cache python3-dev \
    && apk add py3-pip \
    && apk add npm

# RUN apk add sqlite3 libsqlite3-dev 
RUN mkdir /db

RUN adduser -D user

WORKDIR /home/user
COPY . /home/user
RUN npm install
USER user

ENV PATH="/home/user/.local/bin:${PATH}"

RUN pip install --upgrade pip
RUN pip --no-cache install -r requirements.txt

EXPOSE 5000

CMD ["python3", "-m" , "flask", "run", "--host=0.0.0.0"]
