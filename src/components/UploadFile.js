import {Alert, Button, Form} from "react-bootstrap";
import { saveAs } from 'file-saver';
import {useState} from "react";

export default function UploadFile() {

    const [show, setShow] = useState(false);

    const [file, setFile] = useState(null);

    const [result, setResult] = useState(null);

    const [finalText, setFinalText] = useState("");

    function handleUpload(e) {
        let reader = new FileReader();
        reader.onload = ((e) => {
            setResult(e.target.result);
        })
        reader.readAsText(e.target.files[0]);
        setFile(e.target.files[0]);
    }

    function handleParse() {
        setShow(true);
        setTimeout(function(){ setShow(false) }, 2000);

        let lines = result.split("\n");
        let text = "";
        lines.forEach((line) => {
            let parsedLine = splitCSVButIgnoreCommasInDoublequotes(line);
            let accountNumber = parsedLine[0].replace(/"/g, '');
            accountNumber = accountNumber.replace(/ /g, '&nbsp;');
            let aopCode = parsedLine[2].replace(/"/g, '');
            text  +=
                '<tr>\n<td> class="cell1">' + accountNumber + '</td>\n<td class="cell2"><p><strong><#if JSON?has_content>$(JSON.bsScheme._' + aopCode +
                '.description) <#if></strong></p></td>\n<td class="cell3">' + aopCode +
                '</td>\n<td class="cell4"></td>\n<td class="cell5"><strong><#if JSON?has_content>$(JSON.bsScheme._' + aopCode +
                '.balance1)</#if></strong></td>\n<td class="cell5"><strong><#if JSON?has_content>$(JSON.bsScheme._' + aopCode +
                '.balance2)</#if></strong></td>\n<td class="cell5"><strong><#if JSON?has_content>$(JSON.bsScheme._' + aopCode +
                '.balance3)</#if></strong></td>\n</tr>\n'
        })

        setResult(text);
        setFinalText(text);
    }

    function handleDownload() {
        let file = new File([finalText], "final-text.txt", {type: "text/plain;charset=utf-8"});
        saveAs(file);
    }

    function splitCSVButIgnoreCommasInDoublequotes(str) {
        var delimiter = ',';
        var quotes = '"';
        var elements = str.split(delimiter);
        var newElements = [];
        for (var i = 0; i < elements.length; ++i) {
            if (elements[i].indexOf(quotes) >= 0) {//the left double quotes is found
                var indexOfRightQuotes = -1;
                var tmp = elements[i];
                //find the right double quotes
                for (var j = i + 1; j < elements.length; ++j) {
                    if (elements[j].indexOf(quotes) >= 0) {
                        indexOfRightQuotes = j;
                        break;
                    }
                }
                if (-1 != indexOfRightQuotes) {
                    for (var j = i + 1; j <= indexOfRightQuotes; ++j) {
                        tmp = tmp + delimiter + elements[j];
                    }
                    newElements.push(tmp);
                    i = indexOfRightQuotes;
                }
                else {
                    newElements.push(elements[i]);
                }
            }
            else {
                newElements.push(elements[i]);
            }
        }
        return newElements;
    }

    return (
        <div className="w-100 bg-dark row">
            <Form className="w-100 pt-5 pl-5 col-6">
                <Alert variant="success" show={show}>
                    File parsed!
                </Alert>
                <h3 className="text-light text-left mb-5">One Punch Script</h3>
                <Form.Group className="mb-5">
                    <Form.File
                        onChange={(e) => handleUpload(e)}
                        label={!file ? "No file choosen" : file.name}
                        custom
                    />
                </Form.Group>
                <Form.Group className="mb-3" style={{height:"15%"}}>
                    <Button id="fileInput" variant="warning" className="w-25 p-2 ml-3 float-right" onClick={() => handleParse()}>
                        Parse
                    </Button>
                    <Button id="fileInput" variant="danger" className="w-25 p-2 float-right" onClick={() => handleDownload()}>
                        Download
                    </Button>
                </Form.Group>
                <div className="text-dark bg-light pt-4 pre-scrollable">
                    <h2 className="mb-4">Parse result</h2>
                    <div className="mb-5">
                        {result}
                    </div>
                </div>
            </Form>
            <img className="col-6" src="./saitama.png"/>
        </div>
    );
}
