/**
 * Manages sequential steps with persistent storage
 */
export class StepManager<T> {
  private storageKey: string;
  private steps: T[];
  private currentStepIndex: number;

  constructor(storageKey: string, steps: T[]) {
    this.storageKey = storageKey;
    this.steps = steps;
    this.currentStepIndex = this.loadStep();
  }

  /**
   * Load the current step index from GM_storage
   */
  private loadStep(): number {
    const saved = GM_getValue(this.storageKey, 0);
    return typeof saved === "number" ? saved : 0;
  }

  /**
   * Save the current step index to GM_storage
   */
  private saveStep(): void {
    GM_setValue(this.storageKey, this.currentStepIndex);
  }

  /**
   * Get the current step data
   */
  getCurrentStep(): T | null {
    if (this.currentStepIndex >= this.steps.length) {
      return null;
    }
    return this.steps[this.currentStepIndex];
  }

  /**
   * Get the current step index (0-based)
   */
  getCurrentStepIndex(): number {
    return this.currentStepIndex;
  }

  /**
   * Get the next step data without advancing
   */
  getNextStep(): T | null {
    const nextIndex = this.currentStepIndex + 1;
    if (nextIndex >= this.steps.length) {
      return null;
    }
    return this.steps[nextIndex];
  }

  /**
   * Get the previous step data without going back
   */
  getPreviousStep(): T | null {
    const prevIndex = this.currentStepIndex - 1;
    if (prevIndex < 0) {
      return null;
    }
    return this.steps[prevIndex];
  }

  /**
   * Advance to the next step and save
   */
  saveWithNextStep(): boolean {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.saveStep();
      return true;
    }
    return false;
  }

  /**
   * Go back to the previous step and save
   */
  saveWithPreviousStep(): boolean {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.saveStep();
      return true;
    }
    return false;
  }

  /**
   * Check if there are more steps
   */
  hasNextStep(): boolean {
    return this.currentStepIndex < this.steps.length - 1;
  }

  /**
   * Check if there are previous steps
   */
  hasPreviousStep(): boolean {
    return this.currentStepIndex > 0;
  }

  /**
   * Check if all steps are completed
   */
  isComplete(): boolean {
    return this.currentStepIndex >= this.steps.length;
  }

  /**
   * Reset to the first step
   */
  reset(): void {
    this.currentStepIndex = 0;
    this.saveStep();
  }

  /**
   * Clear storage and reset
   */
  clear(): void {
    GM_deleteValue(this.storageKey);
    this.currentStepIndex = 0;
  }

  /**
   * Get total number of steps
   */
  getTotalSteps(): number {
    return this.steps.length;
  }

  /**
   * Get progress as a percentage
   */
  getProgress(): number {
    return (this.currentStepIndex / this.steps.length) * 100;
  }
}

/* Usage:

// Example usage: Change page title 5 times with refreshes
(function() {
    'use strict';

    const titles = ['title1', 'title2', 'title3', 'title4', 'title5'];
    const manager = new StepManager('page_title_steps', titles);

    console.log(`Current step: ${manager.getCurrentStepIndex() + 1}/${manager.getTotalSteps()}`);
    console.log(`Progress: ${manager.getProgress().toFixed(1)}%`);

    const currentTitle = manager.getCurrentStep();

    if (currentTitle === null) {
        console.log('All steps completed!');
        document.title = titles.join('-');

        // Optional: Reset for next run
        // manager.reset();
        return;
    }

    // Build cumulative title
    const allTitlesSoFar = titles.slice(0, manager.getCurrentStepIndex() + 1);
    const newTitle = allTitlesSoFar.join('-');

    console.log(`Setting title to: ${newTitle}`);
    document.title = newTitle;

    // Wait 5 seconds, then advance and refresh
    setTimeout(() => {
        if (manager.hasNextStep()) {
            manager.saveWithNextStep();
            console.log('Advancing to next step and refreshing...');
            location.reload();
        } else {
            console.log('This was the last step!');
            manager.clear(); // Clean up storage
        }
    }, 5000);
})();
*/
