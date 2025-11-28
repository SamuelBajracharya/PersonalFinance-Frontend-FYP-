#define _GNU_SOURCE

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

#define NUM_USERS 10   // Example: 10 users

sem_t printerSemaphore;

void* use_printer(void* arg) {
    int userId = *(int*)arg;

    printf("User %d is waiting to print...\n", userId);

    // Wait until a printer becomes available
    sem_wait(&printerSemaphore);

    // Critical section: using a printer
    printf("User %d is PRINTING...\n", userId);
    sleep(2);  // Simulate printing time

    printf("User %d has finished printing.\n", userId);

    // Release the printer
    sem_post(&printerSemaphore);

    return NULL;
}

int main() {
    pthread_t users[NUM_USERS];
    int userIds[NUM_USERS];

    // Initialize semaphore with a value of 2 (since there are 2 printers)
    sem_init(&printerSemaphore, 0, 2);

    // Create threads to simulate users trying to print
    for (int i = 0; i < NUM_USERS; i++) {
        userIds[i] = i;
        pthread_create(&users[i], NULL, use_printer, &userIds[i]);
    }

    // Wait for all users to finish
    for (int i = 0; i < NUM_USERS; i++) {
        pthread_join(users[i], NULL);
    }

    sem_destroy(&printerSemaphore);

    return 0;
}
