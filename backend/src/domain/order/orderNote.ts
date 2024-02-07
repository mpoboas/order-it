import {ValueObject} from "../../core/domain/ValueObject";
import {Guard} from "../../core/logic/Guard";
import {FailureType, Result} from "../../core/logic/Result";

interface OrderNoteProps {
    text: string;
}

export class OrderNote extends ValueObject<OrderNoteProps>{
    get text(): string {
        return this.props.text;
    }

    private constructor(props: OrderNoteProps) {
        super(props);
    }

    public static create(text: string): Result<OrderNote> {
        // Check if the note is null or undefined.
        const guardResult = Guard.againstNullOrUndefined(text, 'Order Note');
        if (!guardResult.succeeded) {
            return Result.fail<OrderNote>(guardResult.message, FailureType.InvalidInput);
        }

        // Return the note.
        return Result.ok<OrderNote>(new OrderNote({text: text}));
    }
}