
class TransactionResponse {

    response = {
        status: false,
        statusTile: false,
        result : null,
        message : "",
        data: null,
        error:null,
        transaction : null
    };

    constructor() {
    }

    /**
     * set status
     * @param {boolean} status
     * @param {string} statusTitle
     * @returns {TransactionResponse}
     */
    setStatus(status , statusTitle){
        this.response.status = status;
        this.response.statusTile = statusTitle;
        return this;
    }

    /**
     * set message
     * @param {string} message
     * @returns {TransactionResponse}
     */
    setMessage(message){
        this.response.message = message;
        return this;
    }


    /**
     * set result
     * @param {string|number} result
     * @returns {TransactionResponse}
     */
    setResult(result){
        this.response.result = result;
        return this;
    }


    /**
     * set transaction
     * @param {Object} transaction
     * @returns {TransactionResponse}
     */
    setTransaction(transaction){
        this.response.transaction = transaction;
        return this;
    }





    /**
     * set data
     * @param {Array|Object} data
     * @returns {TransactionResponse}
     */
    setData(data){
        this.response.data = data;
        return this;
    }



    /**
     * set error
     * @param {Object} e
     * @returns {TransactionResponse}
     */
    setError(e){
        this.response.error = e;
        return this;
    }


    /**
     * get response
     * @returns {{result: null, data: null, statusTile: boolean, message: string, error: null, transaction: null, status: boolean}}
     */
    getResponse(){
        return this.response
    }


}


export default TransactionResponse;
