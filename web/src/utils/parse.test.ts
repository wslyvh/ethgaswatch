import { WeiToGwei } from './parse';

it('parses wei to gwei', () => {
    const wei = 1000000000;
    const gwei = WeiToGwei(wei)
    
    expect(gwei).toEqual(1000000000 / 1e9);
});

it('parses gwei to ether', () => {
    const gwei = 1000000000;
    const ether = WeiToGwei(gwei)
    
    expect(ether).toEqual(1000000000 / 1e9);
});