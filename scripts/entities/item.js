/**
 * Extend the base Item class to implement additional system-specific logic.
 */
export default class ItemEntity extends Item {

    /** @override */
	prepareData() {
		super.prepareData();
        const item = this.data;
        if (item.data.canHaveBulk && !item.data.bulk) {
            item.data.bulk = 0;
        }
        if (item.data.canHaveValue && !item.data.value) {
            item.data.value = 0;
        }
        if (item.data.canHaveCharges && !item.data.charges) {
            item.data.charges = 0;
        }
	}
}
