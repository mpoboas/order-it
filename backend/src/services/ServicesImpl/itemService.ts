import {Service, Inject} from 'typedi';
import config from '../../../config';
import {FailureType, Result} from '../../core/logic/Result';
import IItemService from "../IServices/IItemService";
import IItemRepo from "../IRepos/IItemRepo";
import ItemCreateDto from "../../dto/create/ItemCreateDto";
import ItemOutDto from "../../dto/out/ItemOutDto";
import {ItemMapper} from "../../mappers/itemMapper";
import ItemEditDto from "../../dto/edit/ItemEditDto";
import {ItemPrice} from "../../domain/item/itemPrice";
import {ItemName} from "../../domain/item/itemName";
import {ItemUnitsQuantity} from "../../domain/item/itemUnitsQuantity";
import {ItemBrandType} from "../../domain/item/itemBrandType";

@Service()
export default class ItemService implements IItemService {
    constructor(
        @Inject(config.repos.item.name) private itemRepo: IItemRepo,
    ) {
    }

    /**
     * Creates a new item.
     * @param itemCreateDto - The Dto of the item to be created.
     * @returns A promise that resolves to a Result object indicating success or failure, with the created item dto as the value.
     */
    public async createItem(itemCreateDto: ItemCreateDto): Promise<Result<ItemOutDto>> {
        try {
            // Create item entity
            const item = await ItemMapper.toDomain(itemCreateDto);

            // Save item entity
            await this.itemRepo.save(item);

            // Return itemDto
            const itemDTOResult = ItemMapper.toDTO(item) as ItemOutDto;
            return Result.ok<ItemOutDto>(itemDTOResult);
        } catch (e) {
            if (e instanceof TypeError) {
                return Result.fail<ItemOutDto>(e.message, FailureType.InvalidInput);
            }
            return Result.fail<ItemOutDto>(e.message, FailureType.DatabaseError);
        }
    }

    /**
     * Lists all items.
     * @returns A promise that resolves to an array of items Dto's.
     */
    public async listItems(): Promise<ItemOutDto[]> {
        try {
            // Get all items from the database
            const items = await this.itemRepo.findAll();

            // Return itemsDto's
            return items.map(item => ItemMapper.toDTO(item) as ItemOutDto);
        } catch (e) {
            throw e;
        }
    }

    public async listItemsByOrder(orderId: string): Promise<ItemOutDto[]> {
        try {
            // Get all items from the database
            const items = await this.itemRepo.findByOrderId(orderId);

            // Return itemsDto's
            return items.map(item => ItemMapper.toDTO(item) as ItemOutDto);
        } catch (e) {
            throw e;
        }
    }

    /**
     * Edits an existing item.
     * @param id - The ID of the item to edit.
     * @param itemEditDto - The updated item DTO.
     * @returns A promise that resolves to a Result object indicating success or failure, with the updated item DTO as the value.
     */
    public async editItem(id: string, itemEditDto: ItemEditDto): Promise<Result<ItemOutDto>> {
        try {
            // Check if the item exists
            const item = await this.itemRepo.findById(id);
            if (!item) {
                return Result.fail<ItemOutDto>(`Item with id=${id} does not exist.`, FailureType.EntityDoesNotExist);
            }

            // Create the Value Objects of the item
            const nameOrError = ItemName.create(itemEditDto.itemName);
            if (nameOrError.isFailure) {
                return Result.fail<ItemOutDto>(nameOrError.errorValue(), FailureType.InvalidInput);
            }
            const priceOrError = ItemPrice.create(itemEditDto.itemPrice);
            if (priceOrError.isFailure) {
                return Result.fail<ItemOutDto>(priceOrError.errorValue(), FailureType.InvalidInput);
            }
            const unitsQuantityOrError = ItemUnitsQuantity.create(itemEditDto.itemUnitsQuantity);
            if (unitsQuantityOrError.isFailure) {
                return Result.fail<ItemOutDto>(unitsQuantityOrError.errorValue(), FailureType.InvalidInput);
            }
            // loop through the enum and check if the brand type is valid
            let brandType: ItemBrandType;
            for (const type in ItemBrandType) {
                if (itemEditDto.itemBrandType.trim().toUpperCase() === type) {
                    brandType = ItemBrandType[type];
                    break;
                }
            }

            item.name = nameOrError.getValue();
            item.price = priceOrError.getValue();
            item.unitsQuantity = unitsQuantityOrError.getValue();
            item.brandType = brandType;

            // If it succeeds, save the updated item
            await this.itemRepo.save(item);

            // Return the item Dto
            const itemDtoResult = ItemMapper.toDTO(item) as ItemOutDto;
            return Result.ok<ItemOutDto>(itemDtoResult);
        } catch (e) {
            if (e instanceof TypeError) {
                return Result.fail<ItemOutDto>(e.message, FailureType.InvalidInput);
            } else {
                return Result.fail<ItemOutDto>(e.message, FailureType.DatabaseError);
            }
        }
    }
}
