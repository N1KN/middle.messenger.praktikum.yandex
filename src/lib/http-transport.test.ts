import { expect } from 'chai';
import sinon, { SinonFakeXMLHttpRequest, SinonFakeXMLHttpRequestStatic } from 'sinon';
import { HttpTransport } from './http-transport';

describe('HttpTransport', () => {
  let xhr: SinonFakeXMLHttpRequestStatic;
  let instance: HttpTransport;
  const requests: SinonFakeXMLHttpRequest[] = [];

  beforeEach(() => {
    xhr = sinon.FakeXMLHttpRequest;

    // @ts-ignore
    global.XMLHttpRequest = xhr;

    xhr.onCreate = (request: SinonFakeXMLHttpRequest) => {
      requests.push(request);
    };

    instance = new HttpTransport('https://ya-praktikum.tech/api/v2');
  });

  afterEach(() => {
    requests.length = 0;
  });

  it('.get() should send GET request', () => {
    instance.get('/auth/user');

    const [request] = requests;

    expect(request.method).to.eq('GET');
  });
});
