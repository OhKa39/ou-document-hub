FROM docker.elastic.co/logstash/logstash:8.12.2

COPY ./bin/ /usr/share/logstash/logstash-core/lib/jars/

# Copy all configuration files to the Logstash config directory
COPY ./conf/ /usr/share/logstash/config/

# Run Logstash with all configuration files in the config directory
CMD ["logstash"]

