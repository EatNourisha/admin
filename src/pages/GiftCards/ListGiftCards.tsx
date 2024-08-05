import { Box, Button, HStack, Modal, Text, useToast } from "@chakra-ui/react";
import {
  GenericTable,
  GenericTableItem,
  MainLayoutContainer,
  PageMotion,
  Topbar,
} from "components";
import { get, destroy } from "utils/makeRequest";
import { useEffect, useState } from "react";
import EditGiftCard from "components/Modals/EditGiftCardModal";
import { navigate } from "@reach/router";

export interface IGiftCard {
  _id: string;
  name: string;
  amount: number;
  subscription_interval: string;
}
function ListGiftCards() {
  const [editGiftCard, setEditGiftCard] = useState<{
    showModal: boolean;
    giftCard?: IGiftCard;
  }>({
    showModal: false,
    giftCard: undefined,
  });
  const [giftCards, setGiftCards] = useState<IGiftCard[]>([]);
  const toast = useToast();

  const handleDeleteGiftCard = (giftCard: IGiftCard) => {
    if (window.confirm("Do you want to continue?")) {
      setGiftCards(
        giftCards.filter((gc) => gc._id!== giftCard._id)
      )
      destroy(`/gift/custom/${giftCard?._id}`);
      toast({
        position: "bottom-right",
        title: "Success",
        description: "Gift card deleted successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const getGiftCards = async () => {
      return await get("/gift/custom");
    };

    getGiftCards().then((data) => {
      //@ts-ignore
      setGiftCards(data?.data?.data);
    });
  }, []);
  return (
    <PageMotion key="users-root" pb="100px">
      <Topbar pageTitle="Gift Cards" />
      <MainLayoutContainer>
        <HStack width="100%" display="flex" justifyContent="flex-end" mb={10}>
          <Button
            onClick={()=> navigate("/giftcards")
            }
            size="md"
            variant="outline"
          >
            Add Gift Card
          </Button>
        </HStack>
        <Box>
          <Box
            borderRadius="8px"
            overflow="hidden"
            shadow="0px 2px 12px rgba(0, 0, 0, 0.05)"
          >
            <GenericTable
              isLoading={false}
              headers={["Name", "Amount", "Action"]}
            >
              {giftCards?.map((value) => (
                <GenericTableItem
                  isClickable={false}
                  key={`customer-table-item:${value?._id}`}
                  
                  cols={[
                    <Text fontSize="14px">{value?.name}</Text>,
                    <Text fontSize="14px">{value?.amount}</Text>,

                    <HStack>
                      {/* <Button size="sm" 
                      onClick={() =>
                        setEditGiftCard({
                          showModal: true,
                          giftCard: value,
                        })
                      }
                      variant="outline">
                        View More
                      </Button> */}
                      <Button
                        onClick={() => handleDeleteGiftCard(value)}
                        size="sm"
                        variant="danger"
                      >
                        Delete
                      </Button>
                    </HStack>,
                  ]}
                />
              ))}
            </GenericTable>
          </Box>
        </Box>
      </MainLayoutContainer>

      <Modal
        isOpen={editGiftCard.showModal}
        onClose={() =>
          setEditGiftCard({ showModal: false, giftCard: undefined })
        }
      >
        <EditGiftCard
          giftCards={giftCards}
          isOpen={editGiftCard.showModal}
          onClose={() =>
            setEditGiftCard({ showModal: false, giftCard: undefined })
          }
          setGiftCards={setGiftCards}
          giftCard={editGiftCard.giftCard}
        />
      </Modal>
    </PageMotion>
  );
}

export default ListGiftCards;
