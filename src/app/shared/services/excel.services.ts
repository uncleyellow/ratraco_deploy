import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable , interval, switchMap } from 'rxjs';
import { environment } from '../environment';
@Injectable({
  providedIn: 'root',
})
export class GoogleSheetsService {
  private apiUrl = `${environment.api.url}`; // URL từ environment
 
  constructor(private http: HttpClient) {}

  getSheetData(id): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }


  getSheet1Data(): Observable<unknown> {
    return this.http.get<unknown>(this.apiUrl);
  }

  getSheet2Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet2');
  }

  getSheet3Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet3');
  }
  getSheet4Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet4');
  }

  getSheet5Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet5');
  }
  getSheet6Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet6');
  }
  getSheet7Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet7');
  }
  getSheet8Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet8');
  }
  getSheet9Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet9');
  }
  getSheet10Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet10');
  }
  getSheet11Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet11');
  }
  getSheet12Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet12');
  }
  getSheet13Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet13');
  }
  getSheet14Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet14');
  }
  getSheet15Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet15');
  }
  getSheet16Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet16');
  }
  getSheet17Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet17');
  }
  getSheet18Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet18');
  }
  getSheet19Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet19');
  }
  getSheet20Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet20');
  }
  getSheet21Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet21');
  }
  getSheet22Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet22');
  }
  getSheet23Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet23');
  }
  getSheet24Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet24');
  }
  getSheet25Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet25');
  }
  getSheet26Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet26');
  }
  getSheet27Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet27');
  }
  getSheet28Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet28');
  }
  getSheet29Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet29');
  }

  getSheet30Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet30');
  }
  getSheet31Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet31');
  }
  getSheet32Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet32');
  }
  getSheet33Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheet33');
  }
  getSheet2b0Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb0');
  }

  getSheet2b1Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb1');
  }

  getTestData(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/tests');
  }

  getSheet2b2Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb2');
  } 

  getSheet2b3Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb3'); 
  }

  getSheet2b4Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb4');
  } 

  getSheet2b5Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb5');
  } 

  getSheet2b6Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb6');
  } 

  getSheet2b7Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb7');
  } 

  getSheet2b8Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb8');
  }   

  getSheet2b9Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb9');
  } 

  getSheet2b10Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb10');
  } 

  getSheet2b11Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb11');
  }   

  getSheet2b12Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb12');
  } 

  getSheet2b13Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb13');
  }

  getSheet2b14Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb14');
  }

  getSheet2b15Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb15');
  }

  getSheet2b16Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb16');
  }

  getSheet2b17Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb17');
  } 

  getSheet2b18Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb18');
  }

  getSheet2b19Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb19');
  }

  getSheet2b20Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb20');
  } 

  getSheet2b21Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb21');
  } 

  getSheet2b22Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb22');
  } 

  getSheet2b23Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb23');
  } 

  getSheet2b24Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb24');
  } 

  getSheet2b25Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb25');
  } 

  // getSheet2b26Data(): Observable<unknown> {
  //   return this.http.get<unknown>('http://localhost:3000/sheetb26');
  // } 
  getSheet2b26Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb26');
  }
  getSheet2b27Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb27');
  }
  getSheet2b28Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb28');
  }
  getSheet2b29Data(): Observable<unknown> {
    return this.http.get<unknown>('http://localhost:3000/sheetb29');
  }
  
  
  // lấy cmt 

  getSheetcmt01data():Observable<unknown>{
    return this.http.get<unknown>('http://localhost:3000/sheetcmt0');
  }
  
    // lấy bảng tổng hợp

    getSheetSum(): Observable<any> {
      return this.http.get<any>('http://localhost:3000/full');
    }

    getSheetPlan2025():Observable<any>{
      return this.http.get<any>('http://localhost:3000/runPlan');
    }
  
  

  














}
