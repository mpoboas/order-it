import { ValueObject } from '../../core/domain/ValueObject';
import { FailureType, Result } from '../../core/logic/Result';
import { Guard } from '../../core/logic/Guard';

interface ItemPriceProps {
  value: number;
}

const MIN_PRICE = 0.01;

export class ItemPrice extends ValueObject<ItemPriceProps> {
  get price(): number {
    return this.props.value;
  }

  private constructor(props: ItemPriceProps) {
    super(props);
  }

  public static create(price: number): Result<ItemPrice> {

    // Assure that the props are not null or undefined.
    const guardResult = Guard.againstNullOrUndefined(price, 'Item Price');
    if (!guardResult.succeeded) {
      return Result.fail<ItemPrice>(guardResult.message, FailureType.InvalidInput);
    }

    // Assure that the price is greater than price minimum.
    const validPrice = price >= MIN_PRICE;
    if (!validPrice) {
      return Result.fail<ItemPrice>('Item price must be greater than 0', FailureType.InvalidInput);
    }

    // If all the checks pass, return the price.
    return Result.ok<ItemPrice>(new ItemPrice({ value: price }));
  }
}
