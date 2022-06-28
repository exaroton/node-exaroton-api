const GetFileInformationRequest = require("../Request/Server/Files/GetFileInformationRequest");
const GetFileDataRequest = require("../Request/Server/Files/GetFileDataRequest");
const PutFileDataRequest = require("../Request/Server/Files/PutFileDataRequest");
const DeleteFileDataRequest = require("../Request/Server/Files/DeleteFileDataRequest");
const CreateDirectoryRequest = require("../Request/Server/Files/CreateDirectoryRequest");

class File {
    /**
     * File path relative to server root
     *
     * @type {string}
     */
    path;

    /**
     * File name
     *
     * @type {string}
     */
    name;

    /**
     * @type {boolean}
     */
    isTextFile;

    /**
     * @type {boolean}
     */
    isConfigFile;

    /**
     * @type {boolean}
     */
    isDirectory;

    /**
     * @type {boolean}
     */
    isLog;

    /**
     * @type {boolean}
     */
    isReadable;

    /**
     * @type {boolean}
     */
    isWritable;

    /**
     * @type {number}
     */
    size;

    /**
     * @type {[File]|null}
     */
    children = null;

    /**
     * @type {{Server}}
     */
    #server;

    /**
     * @type {{Client}}
     */
    #client;

    /**
     * @param {string|null} path
     */
    constructor(path = null) {
        if (path) {
            this.setPath(path);
        }
    }

    /**
     * @param {string} path
     */
    setPath(path) {
        if (path.startsWith("/")) {
            path = path.substring(1);
        }
        this.path = path;
    }

    /**
     * Apply data from the API response
     *
     * @param {object} object
     * @return {File}
     */
    applyData(object) {
        if (typeof object.path !== "undefined") {
            this.setPath(object.path);
        }
        this.name = typeof object.name !== "undefined" ? object.name : null;
        this.isTextFile = typeof object.isTextFile !== "undefined" ? object.isTextFile : null;
        this.isConfigFile = typeof object.isConfigFile !== "undefined" ? object.isConfigFile : null;
        this.isDirectory = typeof object.isDirectory !== "undefined" ? object.isDirectory : null;
        this.isLog = typeof object.isLog !== "undefined" ? object.isLog : null;
        this.isReadable = typeof object.isReadable !== "undefined" ? object.isReadable : null;
        this.isWritable = typeof object.isWritable !== "undefined" ? object.isWritable : null;
        this.size = typeof object.size !== "undefined" ? object.size : null;
        this.children = Array.isArray(object.children) ? object.children.map((child) => new File().applyData(child).setServer(this.#server).setClient(this.#client)) : null;
        return this;
    }

    /**
     * Set the server
     *
     * @param server
     * @returns {this}
     */
    setServer(server) {
        this.#server = server;
        if (Array.isArray(this.children)) {
            for (let child of this.children) {
                child.setServer(server);
            }
        }
        return this;
    }

    /**
     * Set the API client
     *
     * @param client
     * @returns {this}
     */
    setClient(client) {
        this.#client = client;
        if (Array.isArray(this.children)) {
            for (let child of this.children) {
                child.setClient(client);
            }
        }
        return this;
    }

    /**
     * Get file information from the API
     *
     * @returns {Promise<File>}
     */
    async getInfo() {
        const response = await this.#client.request(new GetFileInformationRequest(this.#server.id, this.path));
        this.applyData(response.getData());
        return this;
    }

    /**
     * Get the data/content of a file
     *
     * If you want to download the file to a local file use File.download() instead
     *
     * @return {Promise<string>}
     */
    async getContent() {
        const response = await this.#client.request(new GetFileDataRequest(this.#server.id, this.path));
        return response.getData();
    }

    /**
     * Download the data/content of a file to a local file
     *
     * If you want to use the content of the file directly use File.getContent() instead
     *
     * @param {string} outputPath
     * @return {Promise<Response>}
     */
    async download(outputPath) {
        return await this.#client.request(new GetFileDataRequest(this.#server.id, this.path).setOutputPath(outputPath));
    }

    /**
     * Download the data/content of a file into a writable stream
     *
     * @param {stream.Writable} outputStream
     * @return {Promise<Response>}
     */
    async downloadToStream(outputStream) {
        return await this.#client.request(new GetFileDataRequest(this.#server.id, this.path).setOutputStream(outputStream));
    }

    /**
     * Put the content of a file
     *
     * If you want to upload a local file use File.upload() instead
     *
     * @param {string} content
     * @return {Promise<Response>}
     */
    async putContent(content) {
        return await this.#client.request(new PutFileDataRequest(this.#server.id, this.path).setData(content));
    }

    /**
     * Upload a local file
     *
     * If you want to upload the content of the file directly as a string use File.putContent() instead
     *
     * @param {string} inputPath
     * @return {Promise<Response>}
     */
    async upload(inputPath) {
        return await this.#client.request(new PutFileDataRequest(this.#server.id, this.path).setInputPath(inputPath));
    }

    /**
     * Upload from a readable stream
     *
     * @param {stream.Readable} inputStream
     * @return {Promise<Response>}
     */
    async uploadFromStream(inputStream) {
        return this.#client.request(new PutFileDataRequest(this.#server.id, this.path).setInputStream(inputStream));
    }

    /**
     * Delete the file
     *
     * @return {Promise<Response>}
     */
    async delete() {
        return await this.#client.request(new DeleteFileDataRequest(this.#server.id, this.path));
    }

    /**
     * Create a directory
     *
     * @return {Promise<Response>}
     */
    async createAsDirectory() {
        return await this.#client.request(new CreateDirectoryRequest(this.#server.id, this.path));
    }

    /**
     * Get the children of a directory
     *
     * @return {Promise<[File]|null>}
     */
    async getChildren() {
        if (this.children === null && this.isDirectory) {
            await this.getInfo();
        }

        return this.children;
    }
}

module.exports = File;