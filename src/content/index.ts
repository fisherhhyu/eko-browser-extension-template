declare const eko: any;

eko.sub('test', async function (params: any) {
  console.log('============= test =========', params);
  return 'test:ok';
})
