import { SearchItemDto } from '../models/offer-dto.model';
import {
  imagesFromTitleUrl,
  mapSearchItemToProduct,
  quantityTypeToUnit,
} from './offers-api.service';

describe('mapSearchItemToProduct', () => {
  const baseDto: SearchItemDto = {
    itemId: 12345,
    itemName: 'Jablko Granny Smith',
    buyNowPrice: { amount: 49, currency: 'CZK' },
    titleImageUrl: 'https://aukro.cz/images/foo/thumbnail/bar.jpg',
    quantity: 1,
    quantityType: 'kilograms',
  };

  it('maps itemId to string id', () => {
    expect(mapSearchItemToProduct(baseDto).id).toBe('12345');
  });

  it('prefers buyNowPrice over price', () => {
    const dto: SearchItemDto = {
      ...baseDto,
      buyNowPrice: { amount: 49, currency: 'CZK' },
      price: { amount: 99, currency: 'CZK' },
    };
    expect(mapSearchItemToProduct(dto).basePriceCzk).toBe(49);
  });

  it('falls back to price when buyNowPrice is missing', () => {
    const dto: SearchItemDto = {
      ...baseDto,
      buyNowPrice: undefined,
      price: { amount: 99, currency: 'CZK' },
    };
    expect(mapSearchItemToProduct(dto).basePriceCzk).toBe(99);
  });

  it('uses 0 when both buyNowPrice and price are absent', () => {
    const dto: SearchItemDto = { ...baseDto, buyNowPrice: undefined, price: undefined };
    expect(mapSearchItemToProduct(dto).basePriceCzk).toBe(0);
  });

  it('uses itemName as the fallback for every language when no PRODUCT_NAMES override exists', () => {
    const name = mapSearchItemToProduct(baseDto).name;
    expect(name.cs).toBe('Jablko Granny Smith');
    expect(name.sk).toBe('Jablko Granny Smith');
    expect(name.en).toBe('Jablko Granny Smith');
  });

  it('uses titleImageUrl when present, titleImage.url as fallback', () => {
    const withUrl = mapSearchItemToProduct(baseDto);
    expect(withUrl.images.thumb).toContain('/73x73/');

    const withObj: SearchItemDto = {
      ...baseDto,
      titleImageUrl: undefined,
      titleImage: { url: 'https://aukro.cz/images/foo/thumbnail/bar.jpg' },
    };
    expect(mapSearchItemToProduct(withObj).images.thumb).toContain('/73x73/');
  });

  it('produces empty image paths when no image url is provided', () => {
    const dto: SearchItemDto = { ...baseDto, titleImageUrl: undefined, titleImage: undefined };
    const { images } = mapSearchItemToProduct(dto);
    expect(images).toEqual({ thumb: '', card: '', full: '' });
  });

  it('defaults missing quantity to 1', () => {
    const dto: SearchItemDto = { ...baseDto, quantity: undefined };
    expect(mapSearchItemToProduct(dto).quantity).toBe(1);
  });
});

describe('imagesFromTitleUrl', () => {
  it('returns empty strings for an empty url', () => {
    expect(imagesFromTitleUrl('')).toEqual({ thumb: '', card: '', full: '' });
  });

  it('swaps /thumbnail/ to each target size', () => {
    const out = imagesFromTitleUrl('https://cdn/a/thumbnail/b.jpg');
    expect(out.thumb).toBe('https://cdn/a/73x73/b.jpg');
    expect(out.card).toBe('https://cdn/a/400x300/b.jpg');
    expect(out.full).toBe('https://cdn/a/730x548/b.jpg');
  });

  it('swaps /400x300/ (Aukro sometimes returns card-sized urls)', () => {
    const out = imagesFromTitleUrl('https://cdn/a/400x300/b.jpg');
    expect(out.thumb).toBe('https://cdn/a/73x73/b.jpg');
    expect(out.card).toBe('https://cdn/a/400x300/b.jpg');
    expect(out.full).toBe('https://cdn/a/730x548/b.jpg');
  });

  it('leaves urls without a recognized size segment as-is in all three variants', () => {
    const out = imagesFromTitleUrl('https://cdn/a/original/b.jpg');
    expect(out.thumb).toBe('https://cdn/a/original/b.jpg');
    expect(out.card).toBe('https://cdn/a/original/b.jpg');
    expect(out.full).toBe('https://cdn/a/original/b.jpg');
  });
});

describe('quantityTypeToUnit', () => {
  it('maps "sets" to "pack"', () => {
    expect(quantityTypeToUnit('sets')).toBe('pack');
  });

  it('maps "kilograms" and "weight" to "kg"', () => {
    expect(quantityTypeToUnit('kilograms')).toBe('kg');
    expect(quantityTypeToUnit('weight')).toBe('kg');
  });

  it('maps "pieces" to "pcs"', () => {
    expect(quantityTypeToUnit('pieces')).toBe('pcs');
  });

  it('defaults to "pcs" for undefined or unknown values', () => {
    expect(quantityTypeToUnit(undefined)).toBe('pcs');
    expect(quantityTypeToUnit('fortnights')).toBe('pcs');
  });
});
