FROM alpine:latest

RUN apk add --no-cache python3-dev \
    && apk add py3-pip \
    && pip install --upgrade pip

RUN adduser -D user

USER user
WORKDIR /home/user
COPY . /home/user

ENV PATH="/home/user/.local/bin:${PATH}"

RUN pip --no-cache install -r requirements.txt

EXPOSE 5000

# ENTRYPOINT ["python3"]
# CMD ["app.py"]
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
