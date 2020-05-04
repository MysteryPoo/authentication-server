
import { Singleton } from "./Singleton";
import http from "http";

export class ContainerManager extends Singleton {

    public createGameServerContainer(host : string, password : string) : Promise<number> {
        return new Promise<number>( (resolve, reject) => {
            let postData = JSON.stringify({
                "Image": "farkleinspacegameserver:latest",
                "Env" : [
                    `AUTHIP=host.docker.internal`,
                    `HOST=${host}`,
                    `PASSWORD=${password}`,
                    `TOKEN=1234`
                ],
                "HostConfig" : {
                    "AutoRemove" : true,
                    "PortBindings" : {
                        "9000/tcp" : [
                            {
                                "HostIp" : "0.0.0.0",
                                "HostPort" : undefined
                            }
                        ]
                    },
                    "PublishAllPorts": true
                }
            });
    
            let options = {
                socketPath: '/var/run/docker.sock',
                path: '/containers/create',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': postData.length
                }
            }
    
            const request = http.request(options, (response) => {
                let data = "";
                response.setEncoding('utf8');
                response.on('data', chunk => {
                    data += chunk;
                });
                response.on('error', err => {
                    console.error(err);
                    reject(err);
                });
                response.on('end', () => {
                    let containerId = JSON.parse(data).Id;
                    console.debug(`GameServer container created with id: ${containerId}`)
                    resolve(this.startContainer(containerId));
                });
            });
    
            request.write(postData);
            request.end();
        });
    }

    private async startContainer(containerId : string) : Promise<number> {
        return new Promise<number>( (resolve, reject) => {
            let options = {
                socketPath: '/var/run/docker.sock',
                path: `/containers/${containerId}/start`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': 0
                }
            }
    
            const request = http.request(options, (response) => {
                let data = "";
                response.setEncoding('utf8');
                response.on('data', chunk => {
                    data += chunk;
                });
                response.on('error', err => {
                    console.error(err);
                    reject(err);
                });
                response.on('end', () => {
                    console.debug(`GameServer ${containerId} started...`);
                    resolve(this.getContainerPort(containerId));
                });
            });
    
            request.end();
        });
    }

    private async getContainerPort(containerId : string) : Promise<number> {
        return new Promise<number>( (resolve, reject) => {
            let options = {
                socketPath: '/var/run/docker.sock',
                path: `/containers/${containerId}/json`,
                method: 'GET'
            }
    
            const request = http.request(options, (response) => {
                let data = "";
                response.setEncoding('utf8');
                response.on('data', chunk => {
                    data += chunk;
                });
                response.on('error', err => {
                    console.error(err);
                    reject(err);
                });
                response.on('end', () => {
                    let port = JSON.parse(data).NetworkSettings.Ports["9000/tcp"][0].HostPort;
                    console.debug(`GameServer ${containerId} listening on port ${port}`);
                    resolve(port);
                });
            });
    
            request.end();
        });
    }

}
