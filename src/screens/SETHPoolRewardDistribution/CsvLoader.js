import React from 'react';
import papaparse from 'papaparse';

export default ({ onDataLoaded }) => {
  const onFileChange = event => {
    const fileReader = new FileReader();
    fileReader.onloadend = e => {
      const data = papaparse.parse(
        e.target.result,
        { delimiter: ',', header: false, skipEmptyLines: true }
      ).data;
      onDataLoaded(data);
    }
    if (event.target.files[0]) {
      fileReader.readAsText(event.target.files[0]);
    }
  }
  return <input type="file" name="file" accept=".csv" onChange={onFileChange}/>;
}
